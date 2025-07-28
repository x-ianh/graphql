// Main application class that orchestrates all components
import AppState from './app.js';
import LoginController from './login.js';
import ProfileController from './profile.js';

class App {
    constructor() {
        this.appState = null;
        this.loginController = null;
        this.profileController = null;
    }

    // Initialize the entire application
    async initialize() {
        console.log("Initializing GraphQL App...");
        
        try {
            // Initialize app state
            this.appState = new AppState();
            console.log("App state initialized");

            // Initialize controllers
            this.loginController = new LoginController(this.appState);
            console.log("Login controller initialized");

            // Check authentication status
            await this.checkAuthenticationStatus();

            // Setup global error handling
            this.setupErrorHandling();

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            console.log("App initialization complete");

        } catch (error) {
            console.error("Failed to initialize app:", error);
            this.showInitializationError(error);
        }
    }

    // Check if user is already authenticated and load their profile
    async checkAuthenticationStatus() {
        console.log("Checking authentication status...");
        
        if (this.appState.jwt) {
            console.log("JWT found, attempting to load profile");
            
            try {
                // Validate token by trying to load profile
                this.appState.showView('profile');
                this.profileController = new ProfileController(this.appState);
                await this.profileController.loadProfile();
                
                console.log("User authenticated and profile loaded");
                
            } catch (error) {
                console.warn("JWT exists but is invalid:", error);
                // Clear invalid token and show login
                this.appState.clearToken();
                this.appState.showView('login');
            }
        } else {
            console.log("No JWT found, showing login view");
            this.appState.showView('login');
        }
    }

    // Setup global error handling for the application
    setupErrorHandling() {
        // Global error handler for unhandled promises
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Show user-friendly error message
            this.showGlobalError('An unexpected error occurred. Please refresh the page.');
            
            // Prevent the default behavior (logging to console)
            event.preventDefault();
        });

        // Global error handler for JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global JavaScript error:', event.error);
            
            // Only show error to user if it's not a minor script error
            if (event.error && event.error.stack) {
                this.showGlobalError('A technical error occurred. Please refresh the page.');
            }
        });
    }

    // Monitor application performance metrics
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log(`Page load time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
                        console.log(`DOM content loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`);
                    }
                }, 0);
            });
        }
    }

    // Display global error notifications to user
    showGlobalError(message) {
        // Create or update global error display
        let errorDiv = document.getElementById('global-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'global-error';
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 400px;
                font-family: inherit;
                animation: slideIn 0.3s ease-out;
            `;
            document.body.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px;">⚠️</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">×</button>
            </div>
        `;

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }

    // Display initialization errors
    showInitializationError(error) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ff6b6b;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
                    <h2>Application Failed to Initialize</h2>
                    <p style="margin: 20px 0;">${error.message}</p>
                    <button onclick="location.reload()" 
                            style="padding: 12px 24px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                        Reload Application
                    </button>
                </div>
            `;
        }
    }

    // Get current application status for debugging
    // Run this "window.app.getStatus()" in console to get health check
    getStatus() {
        return {
            currentView: this.appState?.currentView,
            isAuthenticated: !!this.appState?.jwt,
            userId: this.appState?.getUserIdFromToken(),
            controllers: {
                login: !!this.loginController,
                profile: !!this.profileController
            }
        };
    }

    // Manually refresh user authentication/profile data
    async refreshAuth() {
        if (this.profileController && this.appState.jwt) {
            await this.profileController.refreshProfile();
        }
    }

    // Handle user logout
    logout() {
        if (this.profileController) {
            this.profileController.handleLogout();
        } else {
            this.appState.clearToken();
            this.appState.showView('login');
        }
    }
}

// Add CSS animation for error notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", async function() {
    console.log("DOM loaded, starting app...");
    
    const app = new App();
    await app.initialize();
    
    // Make app globally available for debugging
    window.app = app;
    
    console.log("App started successfully. Access via window.app for debugging.");
});

// Export for potential module usage
export default App;