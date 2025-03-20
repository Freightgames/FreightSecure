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
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.gameContainer.appendChild(this.renderer.domElement);
        
        // Create controls
        this.controls = new THREE.PointerLockControls(this.camera, document.body);
        
        // Set up post-processing for visual enhancements
        this.setupPostProcessing();
        
        // Now that Three.js is initialized, it's safe to add the window resize listener
        window.addEventListener('resize', this.onWindowResize);
        
        // Start animation loop
        this.animate();
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
        this.roleSelection.classList.add('hidden');
        
        // Initialize Three.js scene
        this.initThreeJS();
        
        // Set up key controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Initialize environment based on role
        this.environment = new Environment(this.scene, role);
        this.environment.loadOfficeEnvironment().then((interactableObjects) => {
            // Store interactable objects for raycasting
            this.interactableObjects = interactableObjects;
            
            // Initialize tutorial
            this.tutorial = new Tutorial(this, this.controls);
            this.tutorial.start();
        });
    }
    
    startGame() {
        this.isGameActive = true;
        
        // Show HUD
        this.hudElement.classList.remove('hidden');
        
        // Start timer
        this.timerInterval = setInterval(this.updateTimer, 1000);
        
        // Load first scenario based on player role
        this.loadNextScenario();
        
        // Lock controls
        this.controls.lock();
    }
    
    loadNextScenario() {
        // Create new scenario based on player role
        this.currentScenario = new Scenario(this.playerRole);
        this.currentScenario.initialize(this);
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
        // Check if controls exist before trying to access properties
        if (!this.controls) {
            console.log('Controls not initialized yet.');
            return;
        }
        
        if (!this.isGameActive && !this.controls.isLocked) {
            // Try to lock controls if game not active yet (during tutorial)
            this.controls.lock();
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
            
            // Email interface for demo
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
        if (!this.camera || !this.interactableObjects.length) return false;
        
        // Update the picking ray with the camera direction
        this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);
        
        if (intersects.length > 0) {
            // Get the first intersected object
            const object = intersects[0].object;
            
            // Log what was interacted with for debugging
            console.log('Interacting with:', object.name || 'unnamed object');
            
            // Check for specific object types
            if (object.userData && object.userData.type === 'computer' || 
                object.name.includes('computer') || 
                object.name.includes('screen')) {
                // Show computer interface
                this.showComputerInterface();
                return true;
            }
            
            // Trigger the object's interaction if it has one
            if (object.userData && object.userData.interact) {
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
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!window.gameInstance) {
        const game = new FreightSecureGame();
    } else {
        console.log('Using existing game instance');
    }
}); 