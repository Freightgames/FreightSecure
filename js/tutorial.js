// Tutorial class for guiding players through basic controls and objectives
class Tutorial {
    constructor(game, controls) {
        this.game = game;
        this.controls = controls;
        this.tutorialElement = document.getElementById('tutorial');
        this.tutorialContent = document.getElementById('tutorial-content');
        this.nextButton = document.getElementById('next-tutorial');
        
        this.currentStep = 0;
        this.tutorialSteps = [
            {
                message: "Welcome to FreightSecure: Cyber Awareness Training! In this tutorial, you'll learn how to navigate and interact with the environment.",
                action: null
            },
            {
                message: "Use WASD keys to move around and your mouse to look.",
                action: () => this.enableMovement()
            },
            {
                message: "Move to the computer on the desk.",
                action: null,
                condition: () => this.checkProximityToComputer()
            },
            {
                message: "You can interact with objects by clicking on them. Press 'E' or click on the computer screen.",
                action: null,
                condition: () => this.checkComputerInteraction()
            },
            {
                message: "Great! On the computer, you'll check emails, verify carrier/broker profiles, and review rate confirmations for signs of fraud.",
                action: null
            },
            {
                message: "In the game, you'll need to identify phishing attempts, verify business partners, and spot fake documents to earn points.",
                action: null
            },
            {
                message: "Remember, you'll earn +10 points for correctly identifying fraud, +5 for safe actions, and -5 for mistakes.",
                action: null
            },
            {
                message: "The filing cabinet contains important documents you can reference. Try interacting with it.",
                action: null,
                condition: () => this.checkFilingCabinetInteraction()
            },
            {
                message: "Great! You can use the phone to verify partner information. This is crucial for checking broker credit ratings and carrier safety scores.",
                action: null
            },
            {
                message: `As a ${this.game.playerRole}, you'll need to be especially vigilant about ${this.getPlayerRoleSpecificTips()}.`,
                action: null
            },
            {
                message: "You have 5 minutes to complete each level. Ready to begin?",
                action: () => this.finishTutorial()
            }
        ];
        
        // Set up event listeners
        this.nextButton.addEventListener('click', () => this.nextStep());
        
        // Track important objects
        this.computerInteracted = false;
        this.filingCabinetInteracted = false;
        
        // Movement controls
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveSpeed = 0.1;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        // Bind movement update method
        this.manualUpdateMovement = this.manualUpdateMovement.bind(this);
    }
    
    start() {
        // Set game instance tutorial flag
        if (this.game) {
            this.game.isTutorialActive = true;
        }
        
        // Show the tutorial overlay
        if (this.tutorialElement) {
            this.tutorialElement.classList.remove('hidden');
        }
        
        // Add Enter key event listener for advancing tutorial
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                this.nextStep();
            }
        });
        
        // Start with the first step
        this.showStep(0);
    }
    
    nextStep() {
        // Restore tutorial UI visibility
        this.tutorialElement.style.opacity = '1';
        this.tutorialElement.style.pointerEvents = 'auto';
        
        const currentStepObj = this.tutorialSteps[this.currentStep];
        
        // If the current step has a condition that needs to be met
        if (currentStepObj.condition && !currentStepObj.condition()) {
            // Don't advance, just remind the player what to do
            this.tutorialContent.innerHTML = `<p>${currentStepObj.message}</p><p class="tutorial-hint">Please complete this action to continue.</p>`;
            return;
        }
        
        // Remove any existing visual indicators before proceeding
        this.removeVisualIndicators();
        
        // Move to the next step
        this.showStep(this.currentStep + 1);
    }
    
    showStep(stepIndex) {
        if (stepIndex >= this.tutorialSteps.length) {
            // Tutorial is complete
            this.finishTutorial();
            return;
        }
        
        this.currentStep = stepIndex;
        const step = this.tutorialSteps[stepIndex];
        
        // Update the content
        this.tutorialContent.textContent = step.message;
        
        // Add visual indicators based on current step
        this.addVisualIndicators();
        
        // For navigation steps, temporarily hide tutorial UI after a short delay
        if (stepIndex === 2 || stepIndex === 7) {
            setTimeout(() => {
                this.tutorialElement.style.opacity = '0.3';
                this.tutorialElement.style.pointerEvents = 'none';
            }, 3000);
        } else {
            // For other steps, ensure tutorial UI is visible
            this.tutorialElement.style.opacity = '1';
            this.tutorialElement.style.pointerEvents = 'auto';
        }
        
        // Execute the step's action if it has one
        if (step.action) {
            step.action();
        }
    }
    
    enableMovement() {
        // Lock pointer for camera controls
        this.controls.lock();
        
        // Enable movement controls
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        
        // Listen for control lock changes
        this.controls.addEventListener('lock', () => {
            console.log('Controls locked');
        });
        
        this.controls.addEventListener('unlock', () => {
            console.log('Controls unlocked');
        });
        
        // Start movement update loop
        this.startMovementLoop();
    }
    
    startMovementLoop() {
        // Add the movement update to the animation loop
        if (this.game.animate) {
            // Store the original animate method
            const originalAnimate = this.game.animate;
            
            // Override with our new animate that includes movement
            this.game.animate = () => {
                this.manualUpdateMovement();
                originalAnimate();
            };
        }
    }
    
    manualUpdateMovement() {
        // Debug: log movement state
        if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
            console.log('Movement state:', { 
                forward: this.moveForward, 
                backward: this.moveBackward, 
                left: this.moveLeft, 
                right: this.moveRight,
                isLocked: this.controls ? this.controls.isLocked : 'controls not initialized'
            });
        }
        
        if (!this.controls || !this.controls.isLocked) return;
        
        const camera = this.game.camera;
        if (!camera) return;
        
        // Calculate movement direction based on inputs
        const moveZ = Number(this.moveForward) - Number(this.moveBackward);
        const moveX = Number(this.moveRight) - Number(this.moveLeft); // Fixed direction
        
        if (moveZ === 0 && moveX === 0) return;
        
        // Debug: log movement vector
        console.log('Moving with vector:', { moveZ, moveX });
        
        // Forward/backward movement
        if (moveZ !== 0) {
            // Get forward vector
            const forwardVector = new THREE.Vector3(0, 0, -1);
            forwardVector.applyQuaternion(camera.quaternion);
            forwardVector.y = 0; // Keep movement on horizontal plane
            forwardVector.normalize();
            forwardVector.multiplyScalar(moveZ * this.moveSpeed);
            
            // Apply movement
            camera.position.add(forwardVector);
        }
        
        // Left/right movement
        if (moveX !== 0) {
            // Get right vector
            const rightVector = new THREE.Vector3(1, 0, 0);
            rightVector.applyQuaternion(camera.quaternion);
            rightVector.y = 0; // Keep movement on horizontal plane
            rightVector.normalize();
            rightVector.multiplyScalar(moveX * this.moveSpeed);
            
            // Apply movement
            camera.position.add(rightVector);
        }
    }
    
    onKeyDown(event) {
        // Log key press for debugging
        console.log('Key pressed in tutorial:', event.code);
        
        // Handle key presses for movement
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.moveForward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.moveBackward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.moveLeft = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.moveRight = true;
                break;
            case 'KeyE':
                // Interact
                console.log('E key pressed - Interacting');
                this.checkInteraction();
                break;
            case 'Enter':
            case 'NumpadEnter':
                // Advance tutorial
                console.log('Enter key pressed - Advancing tutorial');
                this.nextStep();
                break;
        }
    }
    
    onKeyUp(event) {
        // Handle key releases for movement
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.moveForward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.moveBackward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.moveLeft = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.moveRight = false;
                break;
        }
    }
    
    checkInteraction() {
        // Check if we have a camera
        if (!this.game.camera) return;
        
        // Create a raycaster to detect what the player is looking at
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(), this.game.camera);
        
        // Check for intersections with interactable objects
        const intersects = raycaster.intersectObjects(this.game.interactableObjects);
        
        if (intersects.length > 0) {
            // We hit something interactable
            const object = intersects[0].object;
            console.log('Interacted with object:', object.name || 'unnamed object');
            
            // Check what we're interacting with based on userData or name
            if (object.userData.type === 'computer' || object.name.includes('computer') || object.name.includes('screen')) {
                this.computerInteracted = true;
                this.showComputerInterface();
                if (this.currentStep === 3) {
                    this.nextStep();
                }
            } else if (object.userData.type === 'filingCabinet' || object.name.includes('cabinet')) {
                this.filingCabinetInteracted = true;
                this.showFilingCabinetInterface();
                if (this.currentStep === 7) {
                    this.nextStep();
                }
            }
        } else {
            // For tutorial purposes, provide a fallback for progression
            // This ensures players can still progress even if raycasting fails
            if (this.currentStep === 3) {
                this.computerInteracted = true;
                this.showComputerInterface();
                this.nextStep();
            } else if (this.currentStep === 7) {
                this.filingCabinetInteracted = true;
                this.showFilingCabinetInterface();
                this.nextStep();
            }
        }
    }
    
    checkProximityToComputer() {
        // In a real implementation, this would check the player's position
        // Relative to the computer's position
        
        // For tutorial purposes, we'll auto-progress after player has had time to move around
        if (!this._proximityCheckStarted) {
            this._proximityCheckStarted = true;
            
            // After 5 seconds, assume player has moved around enough
            setTimeout(() => {
                if (this.currentStep === 2) {
                    // Auto-advance to next step
                    console.log("Auto-advancing tutorial step - player considered close enough to computer");
                    this.nextStep();
                }
            }, 5000);
        }
        
        // If player pressed E key, also advance
        if (this.computerInteracted) {
            return true;
        }
        
        return false;
    }
    
    checkComputerInteraction() {
        return this.computerInteracted;
    }
    
    checkFilingCabinetInteraction() {
        return this.filingCabinetInteracted;
    }
    
    showComputerInterface() {
        // Unlock controls so cursor is visible
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show a simple computer interface overlay
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Create a basic email interface
        computerInterface.innerHTML = `
            <div class="email-container">
                <div class="email-header">
                    <h2>Email</h2>
                    <button id="close-computer" class="btn">Close</button>
                </div>
                <div class="email-list">
                    <div class="email-item unread">
                        <span>Welcome to FreightSecure Training</span>
                        <span>10:30 AM</span>
                    </div>
                    <div class="email-content active">
                        <h3>From: FreightSecure Team</h3>
                        <h3>Subject: Welcome to FreightSecure Training</h3>
                        <div class="email-body">
                            <p>Welcome to your cyber awareness training!</p>
                            <p>You will learn to identify and respond to potential fraud attempts.</p>
                            <p>In this tutorial, we're just showing you how to interact with the computer.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add close button functionality
        document.getElementById('close-computer').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            // Re-lock controls when closing interface
            if (this.controls) {
                setTimeout(() => this.controls.lock(), 100);
            }
        });
        
        // Simulate interaction for tutorial
        this.computerInteracted = true;
    }
    
    showPhoneInterface() {
        // Unlock controls so cursor is visible
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show a simple phone interface overlay
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Create a basic phone interface
        computerInterface.innerHTML = `
            <div class="phone-call-container">
                <div class="call-header">
                    <h2>Phone</h2>
                    <button id="close-phone" class="btn">Close</button>
                </div>
                <div class="call-content">
                    <p>This is the phone interface.</p>
                    <p>You will use this to handle calls during the game.</p>
                </div>
            </div>
        `;
        
        // Add close button functionality
        document.getElementById('close-phone').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            // Re-lock controls when closing interface
            if (this.controls) {
                setTimeout(() => this.controls.lock(), 100);
            }
        });
        
        // Simulate interaction for tutorial
        this.phoneInteracted = true;
    }
    
    showFilingCabinetInterface() {
        // Unlock controls so cursor is visible
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show a simple filing cabinet interface overlay
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Create a basic filing cabinet interface
        computerInterface.innerHTML = `
            <div class="rate-confirmation">
                <div class="rate-confirmation-header">
                    <h2>Filing Cabinet</h2>
                </div>
                <div class="rate-confirmation-section">
                    <h3>Tutorial Documents</h3>
                    <p>This is the filing cabinet interface.</p>
                    <p>You will use this to access reference documents during the game.</p>
                </div>
                <button id="close-cabinet" class="btn">Close</button>
            </div>
        `;
        
        // Add close button functionality
        document.getElementById('close-cabinet').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            // Re-lock controls when closing interface
            if (this.controls) {
                setTimeout(() => this.controls.lock(), 100);
            }
        });
        
        // Simulate interaction for tutorial
        this.filingCabinetInteracted = true;
    }
    
    getPlayerRoleSpecificTips() {
        if (this.game.playerRole === 'carrier') {
            return "verifying broker credit ratings, checking payment terms, and authenticating rate confirmations before accepting loads";
        } else {
            return "checking carrier safety scores, verifying USDOT numbers, and confirming carrier credentials before assigning loads";
        }
    }
    
    finishTutorial() {
        console.log('Finishing tutorial and starting game');
        
        // Remove any visual indicators
        this.removeVisualIndicators();
        
        // Hide the tutorial overlay
        this.tutorialElement.classList.add('hidden');
        
        // Clear any event listeners or timers
        if (this.movementCheckInterval) {
            clearInterval(this.movementCheckInterval);
            this.movementCheckInterval = null;
        }
        
        // Make sure controls are unlocked before transitioning
        if (this.controls && this.controls.isLocked) {
            this.controls.unlock();
        }
        
        // Start the game with a slight delay to ensure UI changes have applied
        setTimeout(() => {
            try {
                // Start the game
                this.game.startGame();
                
                // Add a click handler to lock controls on first click after tutorial
                const lockHandler = () => {
                    if (this.controls && !this.controls.isLocked) {
                        this.controls.lock();
                    }
                    document.removeEventListener('click', lockHandler);
                };
                document.addEventListener('click', lockHandler);
                
                // Show a help message to guide the user
                if (this.game.showHelpMessage) {
                    this.game.showHelpMessage('Click to continue playing');
                }
                
                console.log('Game started successfully');
            } catch (e) {
                console.error('Error starting game:', e);
            }
        }, 500);
    }
    
    // Add a method to create visual indicators for guidance
    addVisualIndicators() {
        // Remove any existing indicators
        this.removeVisualIndicators();
        
        // Add indicator based on current step
        if (this.currentStep === 2) {
            // Highlight computer
            this.createIndicatorFor('computer');
        } else if (this.currentStep === 7) {
            // Highlight filing cabinet
            this.createIndicatorFor('filingCabinet');
        }
    }
    
    // Create a visual indicator for the specified object type
    createIndicatorFor(objectType) {
        // Find all objects of the given type in the scene
        const targetObjects = this.game.interactableObjects.filter(obj => 
            obj.userData.type === objectType || 
            obj.name.includes(objectType) ||
            (objectType === 'computer' && obj.name.includes('screen'))
        );
        
        if (targetObjects.length === 0) {
            console.warn('No objects found to highlight for:', objectType);
            return;
        }
        
        // Create indicators for each matching object
        targetObjects.forEach(obj => {
            // Get object position
            const objPosition = new THREE.Vector3();
            obj.getWorldPosition(objPosition);
            
            // Create a bright glowing sphere
            const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00, // Bright green
                transparent: true,
                opacity: 0.8
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(objPosition);
            glow.position.y += 0.5; // Position slightly above the object
            
            // Add to scene
            this.game.scene.add(glow);
            
            // Create floating arrow pointing to the object
            const arrowHeight = 0.5;
            const arrowGeometry = new THREE.ConeGeometry(0.2, arrowHeight, 8);
            const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red
            
            const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrow.position.copy(objPosition);
            arrow.position.y += 1.2; // Position above the object
            arrow.rotation.x = Math.PI; // Point downward
            
            // Add to scene
            this.game.scene.add(arrow);
            
            // Store references for later removal
            this.indicators = this.indicators || [];
            this.indicators.push(glow);
            this.indicators.push(arrow);
            
            // Add animation to both
            this.animateIndicator(glow);
            this.animateArrow(arrow, objPosition.y + 1.2);
        });
    }
    
    // Animate the indicator with a pulsing effect
    animateIndicator(indicator) {
        const startScale = 0.8;
        const endScale = 1.2;
        const duration = 1000; // ms
        
        // Animation using TWEEN if available
        if (typeof TWEEN !== 'undefined') {
            // Scale up
            new TWEEN.Tween(indicator.scale)
                .to({x: endScale, y: endScale, z: endScale}, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(() => {
                    // Scale down
                    new TWEEN.Tween(indicator.scale)
                        .to({x: startScale, y: startScale, z: startScale}, duration)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onComplete(() => {
                            // Repeat the animation
                            this.animateIndicator(indicator);
                        })
                        .start();
                })
                .start();
        }
    }
    
    // Animate the arrow up and down
    animateArrow(arrow, baseY) {
        if (typeof TWEEN === 'undefined') return;
        
        // Move up
        new TWEEN.Tween(arrow.position)
            .to({ y: baseY + 0.3 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                // Move down
                new TWEEN.Tween(arrow.position)
                    .to({ y: baseY }, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onComplete(() => {
                        // Repeat
                        this.animateArrow(arrow, baseY);
                    })
                    .start();
            })
            .start();
    }
    
    // Remove all visual indicators
    removeVisualIndicators() {
        if (this.indicators && this.indicators.length > 0) {
            this.indicators.forEach(indicator => {
                this.game.scene.remove(indicator);
            });
            this.indicators = [];
        }
    }
    
    initialize() {
        console.log('Initializing tutorial');
        this.showTutorialInterface();
        this.advanceToNextStep();
    }
    
    // Add methods to handle interactions with various objects during tutorial
    onComputerInteraction() {
        console.log('Tutorial computer interaction');
        
        // Unlock controls to show cursor
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show a simplified computer interface for the tutorial
        this.showComputerInterface();
        
        // Mark that the player has interacted with the computer
        this.computerInteracted = true;
        
        // If this is the computer interaction step, auto-advance after a delay
        if (this.currentStep === this.tutorialSteps.COMPUTER_INTERACTION) {
            console.log('Auto-advancing tutorial step - player interacted with computer');
            setTimeout(() => this.advanceToNextStep(), 1000);
        }
    }
    
    onPhoneInteraction() {
        console.log('Tutorial phone interaction');
        
        // Unlock controls to show cursor
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show a simplified phone interface for the tutorial
        this.showPhoneInterface();
        
        // Mark that the player has interacted with the phone
        this.phoneInteracted = true;
    }
    
    onFilingCabinetInteraction() {
        console.log('Tutorial filing cabinet interaction');
        
        // Unlock controls to show cursor
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show a simplified filing cabinet interface for the tutorial
        this.showFilingCabinetInterface();
        
        // Mark that the player has interacted with the filing cabinet
        this.filingCabinetInteracted = true;
    }
    
    showTutorialInterface() {
        // ... existing code ...
    }
    
    finishTutorialAndStartGame() {
        // Find the tutorial element
        const tutorialElement = document.getElementById('tutorial');
        if (!tutorialElement) {
            console.error('Tutorial element not found');
            return;
        }
        
        // Hide the standard tutorial interface
        tutorialElement.classList.add('hidden');
        
        // Mark tutorial as completed
        this.isCompleted = true;
        
        // Create a tutorial completion screen with a start game button
        const completionScreen = document.createElement('div');
        completionScreen.id = 'tutorial-completion';
        completionScreen.classList.add('tutorial-completion');
        completionScreen.innerHTML = `
            <div class="completion-content">
                <h2>Tutorial Completed!</h2>
                <p>You've successfully completed the tutorial and are ready to start identifying fraud in the freight industry.</p>
                <p>In the game, you'll encounter various scenarios and need to make decisions about potential fraud situations.</p>
                <div class="tutorial-tips">
                    <h3>Remember these tips:</h3>
                    <ul>
                        <li>Check email domains carefully for misspellings</li>
                        <li>Be suspicious of urgent requests for sensitive information</li>
                        <li>Verify any changed payment details</li>
                        <li>${this.gameInstance.playerRole === 'broker' ? 'Always check carrier safety scores' : 'Always check broker credit ratings'}</li>
                    </ul>
                </div>
                <button id="start-game-btn" class="btn primary-btn">Start Game</button>
            </div>
        `;
        
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .tutorial-completion {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 1000;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .completion-content {
                background: #fff;
                padding: 30px;
                border-radius: 10px;
                max-width: 600px;
                text-align: center;
            }
            .tutorial-tips {
                text-align: left;
                margin: 20px 0;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 5px;
            }
            .primary-btn {
                background: #4CAF50;
                color: white;
                padding: 12px 30px;
                font-size: 18px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
                transition: background 0.3s;
            }
            .primary-btn:hover {
                background: #388E3C;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(completionScreen);
        
        // Add event listener to the start game button
        document.getElementById('start-game-btn').addEventListener('click', () => {
            // Remove the completion screen
            completionScreen.remove();
            
            // Set game instance to active and tutorial as inactive
            this.gameInstance.isTutorialActive = false;
            
            // Reset player position to a good starting point if needed
            if (this.gameInstance.camera) {
                this.gameInstance.camera.position.set(0, 1.6, 0);
                if (this.gameInstance.controls) {
                    this.gameInstance.controls.getObject().position.set(0, 1.6, 0);
                }
            }
            
            try {
                // Start the actual game
                this.gameInstance.startGame();
                console.log('Game started successfully');
            } catch (e) {
                console.error('Error starting game:', e);
            }
        });
    }
} 