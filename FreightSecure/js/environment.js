// Environment class for creating and managing the 3D office environment
class Environment {
    constructor(scene, playerRole) {
        this.scene = scene;
        this.playerRole = playerRole;
        this.interactableObjects = [];
    }
    
    async loadOfficeEnvironment() {
        // Create office based on player role
        // For this demo we're using basic geometries, but a real implementation
        // would likely use imported 3D models (GLTF/GLB)
        
        // Add lighting
        this.setupLighting();
        
        // Add floor
        this.createFloor();
        
        // Add walls
        this.createWalls();
        
        // Add ceiling
        this.createCeiling();
        
        // Add furniture based on role
        if (this.playerRole === 'carrier') {
            await this.createCarrierOffice();
        } else {
            await this.createBrokerOffice();
        }
        
        // Add ambient sounds
        this.setupAmbientSounds();
        
        return this.interactableObjects;
    }
    
    setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sunlight through windows)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        
        this.scene.add(directionalLight);
        
        // Add point lights for lamps
        const deskLamp1 = new THREE.PointLight(0xfff0e0, 0.8, 5);
        deskLamp1.position.set(-2, 2, -3);
        deskLamp1.castShadow = true;
        this.scene.add(deskLamp1);
        
        const deskLamp2 = new THREE.PointLight(0xfff0e0, 0.8, 5);
        deskLamp2.position.set(3, 2, -3);
        deskLamp2.castShadow = true;
        this.scene.add(deskLamp2);
    }
    
    createFloor() {
        // Create floor with PBR materials
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2; // Rotate to horizontal
        floor.position.y = 0;
        floor.receiveShadow = true;
        
        this.scene.add(floor);
    }
    
    createWalls() {
        // Create walls with PBR materials
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xd3d3d3,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Back wall
        const backWallGeometry = new THREE.PlaneGeometry(20, 4);
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.set(0, 2, -10);
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        // Left wall
        const leftWallGeometry = new THREE.PlaneGeometry(20, 4);
        const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
        leftWall.position.set(-10, 2, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
        // Right wall
        const rightWallGeometry = new THREE.PlaneGeometry(20, 4);
        const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
        rightWall.position.set(10, 2, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
        
        // Front wall with door
        const frontWallLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 4),
            wallMaterial
        );
        frontWallLeft.position.set(-6, 2, 10);
        frontWallLeft.rotation.y = Math.PI;
        frontWallLeft.receiveShadow = true;
        this.scene.add(frontWallLeft);
        
        const frontWallRight = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 4),
            wallMaterial
        );
        frontWallRight.position.set(6, 2, 10);
        frontWallRight.rotation.y = Math.PI;
        frontWallRight.receiveShadow = true;
        this.scene.add(frontWallRight);
        
        // Door frame
        const doorFrameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const doorTopGeometry = new THREE.BoxGeometry(4, 0.5, 0.5);
        const doorTop = new THREE.Mesh(doorTopGeometry, doorFrameMaterial);
        doorTop.position.set(0, 3.75, 10);
        doorTop.castShadow = true;
        this.scene.add(doorTop);
        
        const doorLeftGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
        const doorLeft = new THREE.Mesh(doorLeftGeometry, doorFrameMaterial);
        doorLeft.position.set(-2, 2, 10);
        doorLeft.castShadow = true;
        this.scene.add(doorLeft);
        
        const doorRightGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
        const doorRight = new THREE.Mesh(doorRightGeometry, doorFrameMaterial);
        doorRight.position.set(2, 2, 10);
        doorRight.castShadow = true;
        this.scene.add(doorRight);
    }
    
    createCeiling() {
        // Create ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
        const ceilingMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2; // Rotate to horizontal
        ceiling.position.y = 4;
        ceiling.receiveShadow = true;
        
        this.scene.add(ceiling);
    }
    
    async createCarrierOffice() {
        // Add carrier-specific furniture and objects
        
        // Create a desk with computer
        await this.createDesk(-2, 0, -5, Math.PI);
        
        // Create filing cabinets for documentation
        this.createFilingCabinet(-8, 0, -8);
        this.createFilingCabinet(-8, 0, -6);
        
        // Create whiteboard with dispatch information
        this.createWhiteboard(8, 2, -9);
        
        // Create additional desks for dispatch team
        await this.createDesk(5, 0, -5, Math.PI);
        
        // Create a table with coffee machine and water dispenser
        this.createBreakArea(8, 0, 5);
        
        // Create parking lot view through window
        this.createWindow(0, 2, -9.9, 'carrier');
    }
    
    async createBrokerOffice() {
        // Add broker-specific furniture and objects
        
        // Create a reception desk
        await this.createDesk(0, 0, 8, 0);
        
        // Create broker workstations
        await this.createDesk(-5, 0, -5, Math.PI);
        await this.createDesk(0, 0, -5, Math.PI);
        await this.createDesk(5, 0, -5, Math.PI);
        
        // Create filing cabinets for rate confirmations
        this.createFilingCabinet(-9, 0, -8);
        this.createFilingCabinet(-9, 0, -6);
        this.createFilingCabinet(-9, 0, -4);
        
        // Create whiteboard with market rates
        this.createWhiteboard(9, 2, -9);
        
        // Create a table with coffee machine
        this.createBreakArea(8, 0, 5);
        
        // Create cityscape view through window
        this.createWindow(0, 2, -9.9, 'broker');
    }
    
    async createDesk(x, y, z, rotation) {
        // Create desk with PBR materials
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.7,
            metalness: 0.2
        });
        
        // Desk top
        const deskTopGeometry = new THREE.BoxGeometry(3, 0.1, 1.5);
        const deskTop = new THREE.Mesh(deskTopGeometry, deskMaterial);
        deskTop.position.set(x, y + 0.75, z);
        deskTop.rotation.y = rotation;
        deskTop.castShadow = true;
        deskTop.receiveShadow = true;
        this.scene.add(deskTop);
        
        // Desk legs
        const legGeometry = new THREE.BoxGeometry(0.1, 0.75, 0.1);
        
        const frontLeftLeg = new THREE.Mesh(legGeometry, deskMaterial);
        frontLeftLeg.position.set(x - 1.4, y + 0.375, z + 0.65);
        frontLeftLeg.castShadow = true;
        this.scene.add(frontLeftLeg);
        
        const frontRightLeg = new THREE.Mesh(legGeometry, deskMaterial);
        frontRightLeg.position.set(x + 1.4, y + 0.375, z + 0.65);
        frontRightLeg.castShadow = true;
        this.scene.add(frontRightLeg);
        
        const backLeftLeg = new THREE.Mesh(legGeometry, deskMaterial);
        backLeftLeg.position.set(x - 1.4, y + 0.375, z - 0.65);
        backLeftLeg.castShadow = true;
        this.scene.add(backLeftLeg);
        
        const backRightLeg = new THREE.Mesh(legGeometry, deskMaterial);
        backRightLeg.position.set(x + 1.4, y + 0.375, z - 0.65);
        backRightLeg.castShadow = true;
        this.scene.add(backRightLeg);
        
        // Create office chair
        this.createChair(x, y, z + 1, rotation);
        
        // Create computer
        await this.createComputer(x, y, z, rotation);
        
        // Create phone
        this.createPhone(x + 1, y, z, rotation);
        
        // Create some papers
        this.createPapers(x - 0.8, y, z, rotation);
    }
    
    async createComputer(x, y, z, rotation) {
        // Create a simple computer model
        const monitorStandMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.5,
            metalness: 0.8
        });
        
        // Monitor stand
        const standGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.2);
        const stand = new THREE.Mesh(standGeometry, monitorStandMaterial);
        stand.position.set(x, y + 0.8, z - 0.3);
        stand.castShadow = true;
        stand.name = 'computer_stand';
        this.scene.add(stand);
        
        // Monitor
        const monitorMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.5,
            metalness: 0.8
        });
        
        const monitorGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.05);
        const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
        monitor.position.set(x, y + 1.3, z - 0.3);
        monitor.castShadow = true;
        monitor.name = 'computer_monitor';
        this.scene.add(monitor);
        
        // Screen (with emissive material for glow)
        const screenGeometry = new THREE.PlaneGeometry(1.1, 0.7);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x6666ff,
            emissiveIntensity: 0.2,
            roughness: 0.0,
            metalness: 0.0
        });
        
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(x, y + 1.3, z - 0.27);
        screen.name = 'computer_screen';
        screen.userData = { 
            type: 'computer',
            interact: () => {
                // User clicked on the computer
                const gameInstance = window.game;
                if (gameInstance && gameInstance.currentScenario) {
                    gameInstance.currentScenario.onComputerInteraction();
                }
            }
        };
        this.scene.add(screen);
        
        // Add to interactable objects
        this.interactableObjects.push(screen);
        
        // Keyboard
        const keyboardGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.2);
        const keyboardMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.5,
            metalness: 0.5
        });
        
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(x, y + 0.78, z);
        keyboard.castShadow = true;
        keyboard.name = 'computer_keyboard';
        this.scene.add(keyboard);
        
        // Mouse
        const mouseGeometry = new THREE.BoxGeometry(0.1, 0.03, 0.15);
        const mouse = new THREE.Mesh(mouseGeometry, keyboardMaterial);
        mouse.position.set(x + 0.4, y + 0.77, z);
        mouse.castShadow = true;
        mouse.name = 'computer_mouse';
        this.scene.add(mouse);
    }
    
    createPhone(x, y, z, rotation) {
        // Create a simple phone model
        const phoneBaseGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.3);
        const phoneMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.5,
            metalness: 0.7
        });
        
        const phoneBase = new THREE.Mesh(phoneBaseGeometry, phoneMaterial);
        phoneBase.position.set(x, y + 0.78, z);
        phoneBase.rotation.y = rotation;
        phoneBase.castShadow = true;
        this.scene.add(phoneBase);
        
        // Phone handset
        const handsetGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.25);
        const handset = new THREE.Mesh(handsetGeometry, phoneMaterial);
        handset.position.set(x, y + 0.85, z);
        handset.rotation.y = rotation;
        handset.castShadow = true;
        this.scene.add(handset);
        
        // Make the phone interactive
        phoneBase.userData.interact = () => {
            // User clicked on the phone
            const gameInstance = window.game;
            if (gameInstance && gameInstance.currentScenario) {
                gameInstance.currentScenario.onPhoneInteraction();
            }
        };
        
        // Add to interactable objects
        this.interactableObjects.push(phoneBase);
    }
    
    createChair(x, y, z, rotation) {
        // Chair base material
        const chairMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7,
            metalness: 0.3
        });
        
        // Seat
        const seatGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
        const seat = new THREE.Mesh(seatGeometry, chairMaterial);
        seat.position.set(x, y + 0.5, z);
        seat.rotation.y = rotation;
        seat.castShadow = true;
        this.scene.add(seat);
        
        // Back
        const backGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
        const back = new THREE.Mesh(backGeometry, chairMaterial);
        back.position.set(x, y + 0.9, z - 0.25);
        back.rotation.y = rotation;
        back.castShadow = true;
        this.scene.add(back);
        
        // Chair cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
        const cylinder = new THREE.Mesh(cylinderGeometry, chairMaterial);
        cylinder.position.set(x, y + 0.2, z);
        cylinder.castShadow = true;
        this.scene.add(cylinder);
        
        // Chair base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05);
        const base = new THREE.Mesh(baseGeometry, chairMaterial);
        base.position.set(x, y + 0.025, z);
        base.castShadow = true;
        this.scene.add(base);
    }
    
    createPapers(x, y, z, rotation) {
        // Create stack of papers
        const paperMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const paperStackGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.4);
        const paperStack = new THREE.Mesh(paperStackGeometry, paperMaterial);
        paperStack.position.set(x, y + 0.77, z);
        paperStack.rotation.y = rotation + Math.PI / 6; // Slightly angled
        paperStack.castShadow = true;
        this.scene.add(paperStack);
        
        // Make papers interactive
        paperStack.userData.interact = () => {
            // User clicked on papers
            const gameInstance = window.game;
            if (gameInstance && gameInstance.currentScenario) {
                gameInstance.currentScenario.onPaperInteraction();
            }
        };
        
        // Add to interactable objects
        this.interactableObjects.push(paperStack);
    }
    
    createFilingCabinet(x, y, z) {
        // Create filing cabinet
        const cabinetMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.7,
            metalness: 0.5
        });
        
        // Cabinet body
        const cabinetGeometry = new THREE.BoxGeometry(1, 3, 1.5);
        const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
        cabinet.position.set(x, y + 1.5, z);
        cabinet.castShadow = true;
        cabinet.receiveShadow = true;
        cabinet.name = 'filing_cabinet';
        cabinet.userData = {
            type: 'filingCabinet',
            interact: () => {
                // User clicked on the filing cabinet
                const gameInstance = window.game;
                if (gameInstance && gameInstance.currentScenario) {
                    gameInstance.currentScenario.onFilingCabinetInteraction();
                }
            }
        };
        this.scene.add(cabinet);
        
        // Add to interactable objects
        this.interactableObjects.push(cabinet);
        
        // Drawer handles
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            roughness: 0.5,
            metalness: 0.8
        });
        
        // Add four drawers with handles
        for (let i = 0; i < 4; i++) {
            // Drawer divider line
            const dividerGeometry = new THREE.BoxGeometry(1.02, 0.01, 1.52);
            const divider = new THREE.Mesh(dividerGeometry, handleMaterial);
            divider.position.set(x, y + 0.75 * i + 0.38, z);
            divider.name = `filing_cabinet_divider_${i}`;
            this.scene.add(divider);
            
            // Handle
            const handleGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);
            handle.position.set(x, y + 0.75 * i + 0.75, z - 0.7);
            handle.castShadow = true;
            handle.name = `filing_cabinet_handle_${i}`;
            this.scene.add(handle);
        }
    }
    
    createWhiteboard(x, y, z) {
        // Create whiteboard frame
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xA9A9A9,
            roughness: 0.5,
            metalness: 0.5
        });
        
        const frameGeometry = new THREE.BoxGeometry(4, 2.5, 0.1);
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(x, y, z);
        frame.castShadow = true;
        this.scene.add(frame);
        
        // Create whiteboard surface
        const boardMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.1,
            metalness: 0.0
        });
        
        const boardGeometry = new THREE.PlaneGeometry(3.8, 2.3);
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.set(x, y, z + 0.06);
        this.scene.add(board);
        
        // Make the whiteboard interactive
        board.userData.interact = () => {
            // User clicked on the whiteboard
            const gameInstance = window.game;
            if (gameInstance && gameInstance.currentScenario) {
                gameInstance.currentScenario.onWhiteboardInteraction();
            }
        };
        
        // Add to interactable objects
        this.interactableObjects.push(board);
    }
    
    createWindow(x, y, z, type) {
        // Create window frame
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.7,
            metalness: 0.2
        });
        
        const frameGeometry = new THREE.BoxGeometry(6, 3, 0.2);
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(x, y, z);
        frame.castShadow = true;
        this.scene.add(frame);
        
        // Create window glass with environment view
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0xADD8E6,
            roughness: 0.0,
            metalness: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const glassGeometry = new THREE.PlaneGeometry(5.5, 2.5);
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(x, y, z + 0.11);
        this.scene.add(glass);
        
        // Add window dividers
        const dividerHGeometry = new THREE.BoxGeometry(5.5, 0.1, 0.05);
        const dividerH = new THREE.Mesh(dividerHGeometry, frameMaterial);
        dividerH.position.set(x, y, z + 0.12);
        dividerH.castShadow = true;
        this.scene.add(dividerH);
        
        const dividerVGeometry = new THREE.BoxGeometry(0.1, 2.5, 0.05);
        const dividerV = new THREE.Mesh(dividerVGeometry, frameMaterial);
        dividerV.position.set(x, y, z + 0.12);
        dividerV.castShadow = true;
        this.scene.add(dividerV);
    }
    
    createBreakArea(x, y, z) {
        // Create a break area with table, coffee machine, etc.
        // Table
        const tableMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.7,
            metalness: 0.2
        });
        
        const tableTopGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
        tableTop.position.set(x, y + 0.75, z);
        tableTop.castShadow = true;
        tableTop.receiveShadow = true;
        this.scene.add(tableTop);
        
        // Table legs
        const legGeometry = new THREE.BoxGeometry(0.1, 0.75, 0.1);
        
        const frontLeftLeg = new THREE.Mesh(legGeometry, tableMaterial);
        frontLeftLeg.position.set(x - 0.9, y + 0.375, z + 0.4);
        frontLeftLeg.castShadow = true;
        this.scene.add(frontLeftLeg);
        
        const frontRightLeg = new THREE.Mesh(legGeometry, tableMaterial);
        frontRightLeg.position.set(x + 0.9, y + 0.375, z + 0.4);
        frontRightLeg.castShadow = true;
        this.scene.add(frontRightLeg);
        
        const backLeftLeg = new THREE.Mesh(legGeometry, tableMaterial);
        backLeftLeg.position.set(x - 0.9, y + 0.375, z - 0.4);
        backLeftLeg.castShadow = true;
        this.scene.add(backLeftLeg);
        
        const backRightLeg = new THREE.Mesh(legGeometry, tableMaterial);
        backRightLeg.position.set(x + 0.9, y + 0.375, z - 0.4);
        backRightLeg.castShadow = true;
        this.scene.add(backRightLeg);
        
        // Coffee machine
        const machineMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.5,
            metalness: 0.8
        });
        
        const machineGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.3);
        const machine = new THREE.Mesh(machineGeometry, machineMaterial);
        machine.position.set(x - 0.6, y + 1, z);
        machine.castShadow = true;
        this.scene.add(machine);
        
        // Water dispenser
        const dispenserMaterial = new THREE.MeshStandardMaterial({
            color: 0x87CEFA,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        const dispenserGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5);
        const dispenser = new THREE.Mesh(dispenserGeometry, dispenserMaterial);
        dispenser.position.set(x + 0.6, y + 1, z);
        dispenser.castShadow = true;
        this.scene.add(dispenser);
    }
    
    setupAmbientSounds() {
        // Create an audio listener
        const listener = new THREE.AudioListener();
        
        // If there's a camera in the game instance, add the listener to it
        if (window.game && window.game.camera) {
            window.game.camera.add(listener);
        }
        
        // Office ambient sound (keyboard typing, phones ringing, etc.)
        const ambientSound = new THREE.Audio(listener);
        
        // Load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        
        // In a real implementation, you would load an actual sound file
        // For this demo, we'll just simulate the loading
        console.log('Loading ambient office sounds...');
        
        // Create positional audio sources
        if (this.playerRole === 'carrier') {
            // Carrier-specific sounds (truck engine sounds from outside)
            console.log('Loading carrier-specific ambient sounds...');
        } else {
            // Broker-specific sounds (more phone calls, office chatter)
            console.log('Loading broker-specific ambient sounds...');
        }
    }
} 