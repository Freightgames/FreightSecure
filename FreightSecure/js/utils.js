// Utility functions for the FreightSecure game

// Make the game instance globally accessible
window.game = null;

// Format time from seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Create a loading indicator
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <h2>Loading FreightSecure...</h2>
            <div class="loading-spinner"></div>
            <p>Preparing cyber security training environment</p>
        </div>
    `;
    
    // Add some basic styles
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.display = 'flex';
    loadingDiv.style.justifyContent = 'center';
    loadingDiv.style.alignItems = 'center';
    loadingDiv.style.zIndex = '9999';
    
    document.body.appendChild(loadingDiv);
    
    return loadingDiv;
}

function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.style.opacity = '0';
        loadingDiv.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
        }, 500);
    }
}

// Check if WebGL is available
function checkWebGLSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        showWebGLError();
        return false;
    }
    
    return true;
}

function showWebGLError() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'webgl-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h2>WebGL Not Supported</h2>
            <p>Your browser or device does not support WebGL, which is required to run this application.</p>
            <p>Please try using a modern browser like Chrome, Firefox, or Edge on a desktop computer.</p>
        </div>
    `;
    
    // Add some basic styles
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.height = '100%';
    errorDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    errorDiv.style.color = 'white';
    errorDiv.style.display = 'flex';
    errorDiv.style.justifyContent = 'center';
    errorDiv.style.alignItems = 'center';
    errorDiv.style.zIndex = '9999';
    
    document.body.appendChild(errorDiv);
}

// Generic debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Handle fullscreen toggling
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Add keyboard shortcut for fullscreen
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen();
    }
});

// Function to ensure the feedback modal works properly
function fixFeedbackModal() {
    const feedbackModal = document.getElementById('feedback-modal');
    const okButton = document.getElementById('feedback-ok');
    
    if (feedbackModal && okButton) {
        console.log('Setting up feedback modal OK button');
        
        // Remove any existing listeners to avoid duplicates
        const newOkButton = okButton.cloneNode(true);
        okButton.parentNode.replaceChild(newOkButton, okButton);
        
        // Add the click handler to hide the modal
        newOkButton.addEventListener('click', () => {
            console.log('OK button clicked');
            feedbackModal.classList.add('hidden');
        });
        
        // Also add a click handler to close the modal when clicking outside the content
        feedbackModal.addEventListener('click', (event) => {
            if (event.target === feedbackModal) {
                feedbackModal.classList.add('hidden');
            }
        });
        
        // For testing, show the modal for a moment to ensure it can be closed
        if (feedbackModal.classList.contains('hidden')) {
            setTimeout(() => {
                const title = document.getElementById('feedback-title');
                const message = document.getElementById('feedback-message');
                
                if (title && message) {
                    title.textContent = 'Welcome to FreightSecure';
                    message.textContent = 'Click OK to begin your training.';
                }
                
                feedbackModal.classList.remove('hidden');
            }, 2000);
        }
    } else {
        console.error('Feedback modal or OK button not found');
    }
}

// Initialize game when document is ready
document.addEventListener('DOMContentLoaded', () => {
    if (checkWebGLSupport()) {
        const loadingIndicator = showLoadingIndicator();
        
        try {
            // Fix the feedback modal first
            setTimeout(fixFeedbackModal, 500);
            
            // Initialize the game
            window.game = new FreightSecureGame();
            
            // Hide loading indicator after a short delay to ensure everything is loaded
            setTimeout(() => {
                hideLoadingIndicator();
            }, 1500);
        } catch (error) {
            console.error('Error initializing game:', error);
            hideLoadingIndicator();
            
            // Show error message to user
            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '20px';
            errorDiv.style.left = '20px';
            errorDiv.style.padding = '10px';
            errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
            errorDiv.style.color = 'white';
            errorDiv.style.borderRadius = '5px';
            errorDiv.style.zIndex = '9999';
            errorDiv.textContent = 'An error occurred while initializing the game. Please check the console for details.';
            document.body.appendChild(errorDiv);
        }
    }
}); 