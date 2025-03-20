// Main game controller
class FreightSecureGame {
    constructor() {
        // Check if an instance already exists to prevent multiple initializations
        if (window.gameInstance) {
            console.warn('Game instance already exists. Reusing existing instance.');
            return window.gameInstance;
        }
        
        // Game state
        this.playerRole = null; // 'carrier' or 'broker'
        this.score = 0;
        this.timeRemaining = 300; // 5 minutes in seconds
        this.timerInterval = null;
        this.currentScenario = null;
        this.isGameActive = false;
        this.isPointerLockRecovering = false;
        this.isTutorialActive = false; // Flag to track if tutorial is active
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactableObjects = [];
        
        // DOM elements - check if they exist
        this.gameContainer = document.getElementById('game-container');
        this.roleSelection = document.getElementById('role-selection');
        this.tutorialElement = document.getElementById('tutorial');
        this.hudElement = document.getElementById('hud');
        this.computerInterface = document.getElementById('computer-interface');
        this.scoreValue = document.getElementById('score-value');
        this.timerValue = document.getElementById('timer-value');
        this.helpMessageElement = null;
        this.helpMessageTimeout = null;
        
        // Check if required elements exist
        if (!this.gameContainer) {
            console.error('Game container element not found.');
            return;
        }
        
        // Bind methods
        this.onWindowResize = this.onWindowResize.bind(this);
        this.animate = this.animate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        
        // Initialize event listeners (except window resize which we'll bind after initializing Three.js)
        this.initEventListeners();
        
        // Set this instance as the global game instance
        window.gameInstance = this;
        
        // Debug info
        console.log('Game initialized with DOM elements:', {
            gameContainer: !!this.gameContainer,
            roleSelection: !!this.roleSelection,
            tutorialElement: !!this.tutorialElement,
            hudElement: !!this.hudElement,
            computerInterface: !!this.computerInterface
        });
    }
    
    initEventListeners() {
        // Role selection buttons
        const carrierBtn = document.getElementById('carrier-btn');
        const brokerBtn = document.getElementById('broker-btn');
        const feedbackOkBtn = document.getElementById('feedback-ok');
        
        if (carrierBtn) {
            carrierBtn.addEventListener('click', () => this.selectRole('carrier'));
        }
        
        if (brokerBtn) {
            brokerBtn.addEventListener('click', () => this.selectRole('broker'));
        }
        
        // Click/interaction
        window.addEventListener('click', this.onClick);
        
        // Feedback modal OK button
        if (feedbackOkBtn) {
            feedbackOkBtn.addEventListener('click', () => {
                const modal = document.getElementById('feedback-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    }
    
    initThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 0); // Eye level
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        if (this.gameContainer) {
            this.gameContainer.appendChild(this.renderer.domElement);
        }
        
        // Create controls with proper event handling
        this.controls = new THREE.PointerLockControls(this.camera, this.renderer.domElement);
        
        // Add error handling for pointer lock
        this.controls.addEventListener('lock', () => {
            console.log('Pointer lock acquired');
        });
        
        this.controls.addEventListener('unlock', () => {
            console.log('Pointer lock released');
            // Only try to recover if game is active and not in a UI overlay
            if (this.isGameActive && !this.inUIOverlay()) {
                this.handlePointerLockRecovery();
            }
        });
        
        // Handle pointer lock errors
        document.addEventListener('pointerlockerror', (event) => {
            console.warn('Pointer lock error:', event);
            this.isPointerLockRecovering = false;
            // Show a helpful message to the user
            this.showHelpMessage("Click the game window to enable mouse controls");
        });
        
        // Add to scene
        this.scene.add(this.controls.getObject());
        
        // Window resize event
        window.addEventListener('resize', this.onWindowResize);
        
        // Start animation loop
        this.animate();
        
        // Add keyboard control
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Initialize environment based on role
        this.environment = new Environment(this.scene, this.playerRole);
        this.environment.loadOfficeEnvironment().then((interactableObjects) => {
            // Store interactable objects for raycasting
            this.interactableObjects = interactableObjects;
            
            // Initialize tutorial with proper game instance
            this.tutorial = new Tutorial(this, this.controls);
            if (this.tutorial) {
                this.tutorial.start();
            } else {
                console.error('Failed to initialize tutorial');
            }
        });
    }
    
    // Add helper method to check if we're in a UI overlay
    inUIOverlay() {
        return !this.computerInterface.classList.contains('hidden') || 
               document.getElementById('feedback-modal')?.classList.contains('hidden') === false;
    }
    
    setupPostProcessing() {
        // Create composer
        this.composer = new THREE.EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom pass for glowing effects (computer screens, etc.)
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);
    }
    
    selectRole(role) {
        this.playerRole = role;
        console.log(`Selected role: ${role}`);
        
        // Hide role selection screen
        if (this.roleSelection) {
            this.roleSelection.classList.add('hidden');
        }
        
        // Initialize Three.js scene
        this.initThreeJS();
        
        // Set up key controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Initialize environment based on role
        this.environment = new Environment(this.scene, role);
        this.environment.loadOfficeEnvironment().then((interactableObjects) => {
            // Store interactable objects for raycasting
            this.interactableObjects = interactableObjects;
            
            // Initialize tutorial with proper game instance
            this.tutorial = new Tutorial(this, this.controls);
            if (this.tutorial) {
                this.tutorial.start();
            } else {
                console.error('Failed to initialize tutorial');
            }
        });
    }
    
    startGame() {
        console.log('Starting game with player role:', this.playerRole);
        
        // Ensure tutorial is inactive and game is active
        this.isTutorialActive = false;
        this.isGameActive = true;
        
        // Show HUD
        if (this.hudElement) {
            this.hudElement.classList.remove('hidden');
        }
        
        // Start timer
        this.timerInterval = setInterval(this.updateTimer, 1000);
        
        // Log the state before loading scenario
        console.log('Game state before loading scenario:', {
            playerRole: this.playerRole,
            isGameActive: this.isGameActive,
            isTutorialActive: this.isTutorialActive
        });
        
        // Load first scenario based on player role
        const scenarioLoaded = this.loadNextScenario();
        
        console.log('Scenario loaded:', scenarioLoaded, 'Current scenario type:', this.currentScenarioType);
        
        // Add a one-time click handler to lock controls when game starts
        const lockHandler = () => {
            if (this.controls && !this.controls.isLocked && this.isGameActive) {
                try {
                    this.controls.lock();
                } catch (e) {
                    console.warn('Could not lock controls on game start:', e);
                }
            }
            document.removeEventListener('click', lockHandler);
        };
        document.addEventListener('click', lockHandler);
        
        // Show help message to guide the user
        this.showHelpMessage('Click to start playing');
    }
    
    loadNextScenario() {
        try {
            console.log('Loading next scenario');
            
            // Create new scenario based on player role
            if (!this.playerRole) {
                console.error('Cannot load scenario: Player role not set');
                return false;
            }
            
            this.currentScenario = new Scenario(this.playerRole);
            
            // Verify the scenario was created properly
            if (!this.currentScenario) {
                console.error('Failed to create new scenario instance');
                return false;
            }
            
            this.currentScenario.initialize(this);
            
            // Verify initialization was successful by checking critical properties
            if (!this.currentScenario.scenarioType) {
                console.error('Scenario initialization failed: No scenario type set');
                this.currentScenario = null;
                return false;
            }
            
            // After initializing the scenario, create a reference to the specific type
            // This helps ensure the scenario type is accessible throughout the game
            this.currentScenarioType = this.currentScenario.scenarioType;
            
            console.log('Scenario initialized:', this.currentScenario.scenarioType);
            
            // Ensure the computer interface is configured for the current scenario
            this.configureInterfaces();
            
            // Make sure controls are locked for game play
            if (this.controls && document.pointerLockElement !== document.body) {
                setTimeout(() => {
                    try {
                        this.controls.lock();
                    } catch (e) {
                        console.warn('Error locking controls after loading scenario:', e);
                    }
                }, 100);
            }
            
            return true;
        } catch (e) {
            console.error('Error loading next scenario:', e);
            this.currentScenario = null;
            return false;
        }
    }
    
    // Configure interfaces based on current scenario type
    configureInterfaces() {
        if (!this.currentScenario) {
            console.warn('No active scenario to configure interfaces for');
            return;
        }
        
        // Pre-load any necessary data for quick access when interacting with objects
        const scenarioType = this.currentScenario.scenarioType;
        
        console.log(`Configuring interfaces for scenario type: ${scenarioType}`);
        
        // Additional setup based on scenario type could be added here
    }
    
    updateScore(points) {
        this.score += points;
        this.scoreValue.textContent = this.score;
        
        // Show feedback
        let title, message;
        if (points > 0) {
            title = "Correct!";
            message = "Good job identifying the security issue!";
        } else {
            title = "Incorrect";
            message = "You missed a security issue. Stay vigilant!";
        }
        
        this.showFeedback(title, message);
    }
    
    updateTimer() {
        this.timeRemaining--;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerValue.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if (this.timeRemaining <= 0) {
            clearInterval(this.timerInterval);
            this.endGame();
        }
    }
    
    showFeedback(title, message) {
        // Unlock controls so cursor is visible
        if (this.controls) {
            this.controls.unlock();
        }
        
        const modal = document.getElementById('feedback-modal');
        const titleElement = document.getElementById('feedback-title');
        const messageElement = document.getElementById('feedback-message');
        
        // Ensure elements exist before trying to set content
        if (titleElement && messageElement) {
            titleElement.textContent = title || '';
            messageElement.textContent = message || '';
        }
        
        // Make the modal visible
        if (modal) {
            modal.classList.remove('hidden');
            
            // Re-attach the event listener to ensure it works
            const okButton = document.getElementById('feedback-ok');
            if (okButton) {
                // Remove existing listeners to avoid duplicates
                const newOkButton = okButton.cloneNode(true);
                okButton.parentNode.replaceChild(newOkButton, okButton);
                
                // Add new listener
                newOkButton.addEventListener('click', () => {
                    modal.classList.add('hidden');
                    
                    // Re-lock controls when closing feedback if game is active
                    if (this.isGameActive && this.controls) {
                        this.controls.lock();
                    }
                });
            }
        }
    }
    
    endGame() {
        this.isGameActive = false;
        
        // Show end game screen with score
        this.showFeedback(
            "Game Over",
            `Your final score: ${this.score}\n\nRemember these best practices:\n` +
            "• Always verify email domains\n" +
            "• Check CSA scores for carriers\n" +
            "• Verify broker credit ratings\n" +
            "• Never share account credentials\n" +
            "• Report suspicious activity immediately"
        );
        
        // Unlock controls
        this.controls.unlock();
    }
    
    onClick(event) {
        // Ensure the game is initialized
        if (!this.scene || !this.camera) {
            console.log('Game not fully initialized yet');
            return;
        }
        
        // Check if controls exist before trying to access properties
        if (!this.controls) {
            console.log('Controls not initialized yet.');
            return;
        }
        
        if (!this.isGameActive && !this.controls.isLocked) {
            // Try to lock controls if game not active yet (during tutorial)
            try {
                this.controls.lock();
            } catch (e) {
                console.warn('Could not acquire pointer lock:', e);
            }
            return;
        }
        
        if (!this.controls.isLocked) return;
        
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);
        
        if (intersects.length > 0) {
            // Get the first intersected object
            const object = intersects[0].object;
            
            // Log what was clicked for debugging
            console.log('Clicked on:', object.name || 'unnamed object');
            
            // Trigger the object's interaction
            if (object.userData && object.userData.interact) {
                object.userData.interact();
            }
        }
    }
    
    // Add a method to show computer interface with proper cursor control
    showComputerInterface() {
        // Unlock controls to show cursor
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show computer interface overlay
        const computerInterface = document.getElementById('computer-interface');
        if (computerInterface) {
            computerInterface.classList.remove('hidden');
            
            // Check if there's an active scenario and use that to determine what to show
            if (this.currentScenario) {
                // Let the scenario handle showing the appropriate interface
                if (this.currentScenario.scenarioType === this.currentScenario.scenarioTypes.PHISHING_EMAIL) {
                    this.currentScenario.showEmailInterface();
                    return;
                }
            }
            
            // Fallback email interface if no scenario is active
            computerInterface.innerHTML = `
                <div class="email-container">
                    <div class="email-header">
                        <h2>Email</h2>
                        <button id="close-computer" class="btn">Close</button>
                    </div>
                    <div class="email-list">
                        <div class="email-item unread">
                            <span>Freight Opportunity</span>
                            <span>Today, 10:30 AM</span>
                        </div>
                        <div class="email-item">
                            <span>Invoice #12345</span>
                            <span>Yesterday, 3:45 PM</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Add close functionality
            document.getElementById('close-computer').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                // Re-lock controls when closing
                if (this.isGameActive && this.controls) {
                    this.controls.lock();
                }
            });
        }
    }
    
    // Modify the checkInteraction method to use the new interface method
    checkInteraction() {
        if (!this.camera || !this.interactableObjects.length) {
            console.log('Camera or interactable objects not initialized');
            return false;
        }
        
        // Calculate objects the player is looking at
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            // Log what was interacted with for debugging
            console.log('Interacting with:', object.name || 'unnamed object', object);
            console.log('Game state:', { 
                isTutorialActive: this.isTutorialActive, 
                isGameActive: this.isGameActive, 
                hasScenario: !!this.currentScenario 
            });
            
            // Check for specific object types based on name or userData
            if (object.userData && object.userData.type === 'computer' || 
                object.name && (object.name.includes('computer') || object.name.includes('Computer') || 
                               object.name.includes('screen') || object.name.includes('Screen'))) {
                
                // Clear priority: Tutorial > Game with scenario > Default behavior
                if (this.isTutorialActive && this.tutorial) {
                    console.log('Tutorial is handling computer interaction');
                    this.tutorial.onComputerInteraction();
                    return true;
                }
                
                // If game isn't active yet at all (before tutorial start even)
                if (!this.isGameActive && !this.isTutorialActive) {
                    console.warn('Game not active yet, ignoring computer interaction');
                    this.showHelpMessage('Please select a role to start the game first');
                    return true;
                }
                
                // Game is active, but no scenario (transition state or error)
                if (this.isGameActive && !this.currentScenario) {
                    console.warn('Game active but no scenario available');
                    // Try to reload a scenario
                    if (this.loadNextScenario()) {
                        console.log('Successfully loaded new scenario, handling interaction');
                        this.currentScenario.onComputerInteraction();
                    } else {
                        console.error('Failed to load scenario for interaction');
                        this.showDefaultEmailInterface();
                    }
                    return true;
                }
                
                // Normal game play with active scenario
                if (this.isGameActive && this.currentScenario) {
                    console.log('Game with scenario handling computer interaction');
                    this.currentScenario.onComputerInteraction();
                    return true;
                }
                
                // Fallback - shouldn't reach here with proper state management
                console.warn('Unhandled game state in computer interaction');
                this.showDefaultEmailInterface();
                return true;
            }
            
            if (object.userData && object.userData.type === 'phone' || 
                object.name && (object.name.includes('phone') || object.name.includes('Phone'))) {
                
                // Clear priority: Tutorial > Game with scenario > Default behavior
                if (this.isTutorialActive && this.tutorial) {
                    console.log('Tutorial is handling phone interaction');
                    this.tutorial.onPhoneInteraction();
                    return true;
                }
                
                // If game isn't active yet at all
                if (!this.isGameActive && !this.isTutorialActive) {
                    console.warn('Game not active yet, ignoring phone interaction');
                    this.showHelpMessage('Please select a role to start the game first');
                    return true;
                }
                
                // Game is active, but no scenario (transition state or error)
                if (this.isGameActive && !this.currentScenario) {
                    console.warn('Game active but no scenario available for phone');
                    // Try to reload a scenario
                    if (this.loadNextScenario()) {
                        console.log('Successfully loaded new scenario, handling phone interaction');
                        this.currentScenario.onPhoneInteraction();
                    } else {
                        console.error('Failed to load scenario for phone interaction');
                        this.showDefaultPhoneInterface();
                    }
                    return true;
                }
                
                // Normal game play with active scenario
                if (this.isGameActive && this.currentScenario) {
                    console.log('Game with scenario handling phone interaction');
                    this.currentScenario.onPhoneInteraction();
                    return true;
                }
                
                // Fallback - shouldn't reach here with proper state management
                console.warn('Unhandled game state in phone interaction');
                this.showDefaultPhoneInterface();
                return true;
            }
            
            if (object.userData && object.userData.type === 'filing_cabinet' || 
                object.name && (object.name.includes('filing') || object.name.includes('cabinet'))) {
                
                // Clear priority: Tutorial > Game with scenario > Default behavior
                if (this.isTutorialActive && this.tutorial) {
                    console.log('Tutorial is handling filing cabinet interaction');
                    this.tutorial.onFilingCabinetInteraction();
                    return true;
                }
                
                // If game isn't active yet at all
                if (!this.isGameActive && !this.isTutorialActive) {
                    console.warn('Game not active yet, ignoring filing cabinet interaction');
                    this.showHelpMessage('Please select a role to start the game first');
                    return true;
                }
                
                // Game is active with scenario
                if (this.isGameActive && this.currentScenario) {
                    console.log('Game with scenario handling filing cabinet interaction');
                    this.currentScenario.onFilingCabinetInteraction();
                    return true;
                }
                
                // No need for fallback interface for filing cabinet
                console.warn('No active scenario for filing cabinet interaction');
                return true;
            }
            
            // If the object has a custom interact function in its userData, use that
            if (object.userData && typeof object.userData.interact === 'function') {
                object.userData.interact();
                return true;
            }
        }
        
        return false;
    }
    
    // Add keydown event handler for game controls
    handleKeyDown(event) {
        if (event.code === 'KeyE') {
            // E key for interaction
            this.checkInteraction();
        }
    }
    
    onWindowResize() {
        // Update camera
        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        
        // Update renderer and composer
        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    animate() {
        // Start next animation frame
        requestAnimationFrame(this.animate);
        
        // Update any animations or movements
        if (typeof TWEEN !== 'undefined') {
            TWEEN.update();
        } else {
            console.warn('TWEEN is not defined. Animations may not work properly.');
        }
        
        // Render the scene with post-processing
        if (this.composer) {
            this.composer.render();
        } else if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    // Add method to show default email interface when no scenario is active
    showDefaultEmailInterface() {
        // Unlock controls to show cursor
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show computer interface overlay
        const computerInterface = document.getElementById('computer-interface');
        if (computerInterface) {
            computerInterface.classList.remove('hidden');
            
            // Fallback email interface
            computerInterface.innerHTML = `
                <div class="email-container">
                    <div class="email-header">
                        <h2>Email</h2>
                        <button id="close-computer" class="btn">Close</button>
                    </div>
                    <div class="email-list">
                        <div class="email-item unread">
                            <span>Freight Opportunity</span>
                            <span>Today, 10:30 AM</span>
                        </div>
                        <div class="email-item">
                            <span>Weekly Team Update</span>
                            <span>Yesterday, 3:45 PM</span>
                        </div>
                        <div class="email-item">
                            <span>Invoice #12345</span>
                            <span>Yesterday, 3:45 PM</span>
                        </div>
                    </div>
                    <div class="email-content active">
                        <h3>From: FreightSecure System</h3>
                        <h3>Subject: System Test Email</h3>
                        <div class="email-body">
                            <p>This is a test email to verify the system is working.</p>
                            <p>No scenario is currently active.</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-computer').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.controls) {
                    setTimeout(() => this.controls.lock(), 100);
                }
            });
        }
    }
    
    // Add method to show default phone interface when no scenario is active
    showDefaultPhoneInterface() {
        // Unlock controls to show cursor
        if (this.controls) {
            this.controls.unlock();
        }
        
        // Show interface overlay
        const computerInterface = document.getElementById('computer-interface');
        if (computerInterface) {
            computerInterface.classList.remove('hidden');
            
            // Fallback phone interface
            computerInterface.innerHTML = `
                <div class="phone-call-container">
                    <div class="call-header">
                        <h2>Phone</h2>
                        <button id="close-phone" class="btn">Close</button>
                    </div>
                    <div class="call-content">
                        <p>No active calls at this time.</p>
                        <p>Please check back later.</p>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-phone').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.controls) {
                    setTimeout(() => this.controls.lock(), 100);
                }
            });
        }
    }
    
    // Add helper method to show a temporary help message
    showHelpMessage(message) {
        if (!this.helpMessageElement) {
            this.helpMessageElement = document.createElement('div');
            this.helpMessageElement.style.position = 'absolute';
            this.helpMessageElement.style.bottom = '20px';
            this.helpMessageElement.style.left = '50%';
            this.helpMessageElement.style.transform = 'translateX(-50%)';
            this.helpMessageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.helpMessageElement.style.color = 'white';
            this.helpMessageElement.style.padding = '10px 20px';
            this.helpMessageElement.style.borderRadius = '5px';
            this.helpMessageElement.style.fontWeight = 'bold';
            this.helpMessageElement.style.zIndex = '1000';
            this.helpMessageElement.style.display = 'none';
            document.body.appendChild(this.helpMessageElement);
        }
        
        this.helpMessageElement.textContent = message;
        this.helpMessageElement.style.display = 'block';
        
        // Clear any existing timeout
        if (this.helpMessageTimeout) {
            clearTimeout(this.helpMessageTimeout);
        }
        
        // Hide the message after 5 seconds
        this.helpMessageTimeout = setTimeout(() => {
            this.helpMessageElement.style.display = 'none';
        }, 5000);
    }
    
    // Modify the pointer lock recovery logic
    handlePointerLockRecovery() {
        if (this.isGameActive && !this.inUIOverlay() && !this.isPointerLockRecovering) {
            this.isPointerLockRecovering = true;
            
            // Show a message to guide the user
            this.showHelpMessage('Click to resume playing');
            
            // Add a one-time click handler
            const lockHandler = () => {
                if (this.controls && !this.controls.isLocked && this.isGameActive && !this.inUIOverlay()) {
                    try {
                        this.controls.lock();
                    } catch (e) {
                        console.warn('Could not reacquire pointer lock:', e);
                    }
                }
                document.removeEventListener('click', lockHandler);
                this.isPointerLockRecovering = false;
            };
            document.addEventListener('click', lockHandler);
        }
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!window.gameInstance) {
        const game = new FreightSecureGame();
    } else {
        console.log('Using existing game instance');
    }
}); 