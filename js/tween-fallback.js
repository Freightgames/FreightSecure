// Fallback TWEEN implementation if the CDN version fails to load
if (typeof TWEEN === 'undefined') {
    console.warn('TWEEN library not loaded from CDN. Using minimal fallback implementation.');
    
    // Create a simple TWEEN object with update method that does nothing
    window.TWEEN = {
        update: function() {
            // Empty implementation
            return false;
        },
        // Simple Tween constructor that provides minimal functionality
        Tween: function() {
            return {
                to: function() { return this; },
                start: function() { return this; },
                onComplete: function() { return this; },
                easing: function() { return this; },
                delay: function() { return this; }
            };
        }
    };
}

console.log('TWEEN fallback loaded. TWEEN object available:', typeof TWEEN !== 'undefined'); 