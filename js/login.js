// Controls the login form functionality and user authentication flow
import AuthService from './auth.js';
import ProfileController from './profile.js';

class LoginController {
    constructor(appState) {
        this.appState = appState;
        this.form = null;
        this.identifierInput = null;
        this.passwordInput = null;
        this.errorElement = null;
        this.submitButton = null;
        
        this.setupEventListeners();
    }

    // Initialize form elements and event listeners
    setupEventListeners() {
        this.form = document.getElementById("loginForm");
        this.identifierInput = document.getElementById("identifier");
        this.passwordInput = document.getElementById("password");
        this.errorElement = document.getElementById("error");

        if (!this.form || !this.identifierInput || !this.passwordInput || !this.errorElement) {
            console.error("One or more login form elements not found!");
            return;
        }

        this.submitButton = this.form.querySelector('button[type="submit"]');
        
        this.form.addEventListener("submit", this.handleLogin.bind(this));
        
        // Add real-time validation
        this.identifierInput.addEventListener("input", this.clearError.bind(this));
        this.passwordInput.addEventListener("input", this.clearError.bind(this));
        
        // Add Enter key support
        this.identifierInput.addEventListener("keypress", this.handleKeyPress.bind(this));
        this.passwordInput.addEventListener("keypress", this.handleKeyPress.bind(this));

        console.log("Login form controller initialized");
    }

    // Handle Enter key press to submit form
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.form.dispatchEvent(new Event('submit'));
        }
    }

    // Clear error messages
    clearError() {
        if (this.errorElement) {
            this.errorElement.textContent = "";
        }
    }

    // Display error message to user
    showError(message) {
        if (this.errorElement) {
            this.errorElement.textContent = message;
        }
    }

    // Toggle loading state of form elements
    setLoadingState(isLoading) {
        if (this.submitButton) {
            this.submitButton.disabled = isLoading;
            this.submitButton.textContent = isLoading ? "Logging in..." : "Login";
        }
        
        if (this.identifierInput) this.identifierInput.disabled = isLoading;
        if (this.passwordInput) this.passwordInput.disabled = isLoading;
    }

    // Validate form inputs
    validateInputs(identifier, password) {
        if (!identifier) {
            this.showError("Username/email is required.");
            this.identifierInput?.focus();
            return false;
        }

        if (!password) {
            this.showError("Password is required.");
            this.passwordInput?.focus();
            return false;
        }

        if (identifier.length < 2) {
            this.showError("Username/email must be at least 2 characters.");
            this.identifierInput?.focus();
            return false;
        }

        if (password.length < 3) {
            this.showError("Password must be at least 3 characters.");
            this.passwordInput?.focus();
            return false;
        }

        return true;
    }

    // Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        console.log("Login form submitted");

        this.clearError();

        const identifier = this.identifierInput.value.trim();
        const password = this.passwordInput.value;

        // Validate inputs
        if (!this.validateInputs(identifier, password)) {
            return;
        }

        // Set loading state
        this.setLoadingState(true);

        try {
            console.log("Attempting login for:", identifier);
            const token = await AuthService.login(identifier, password);
            
            // Save token to app state
            this.appState.setToken(token);
            console.log("Login successful, JWT saved:", token.substring(0, 30) + "...");
            
            // Clear form
            this.form.reset();
            
            // Switch to profile view
            this.appState.showView('profile');
            
            // Initialize and load profile
            const profileController = new ProfileController(this.appState);
            await profileController.loadProfile();

        } catch (err) {
            console.error("Login failed:", err);
            
            // Show user-friendly error messages
            let errorMessage = "Login failed. Please try again.";
            
            if (err.message.includes("Invalid credentials")) {
                errorMessage = "Invalid username/email or password.";
            } else if (err.message.includes("network") || err.message.includes("fetch")) {
                errorMessage = "Network error. Please check your connection.";
            } else if (err.message.includes("token")) {
                errorMessage = "Authentication error. Please try again.";
            }
            
            this.showError(errorMessage);
            this.passwordInput?.focus();
            
        } finally {
            // Reset loading state
            this.setLoadingState(false);
        }
    }

    // Method to programmatically trigger login (useful for testing)
    async login(identifier, password) {
        this.identifierInput.value = identifier;
        this.passwordInput.value = password;
        
        const submitEvent = new Event('submit');
        this.form.dispatchEvent(submitEvent);
    }

    // Reset form state
    reset() {
        if (this.form) {
            this.form.reset();
        }
        this.clearError();
        this.setLoadingState(false);
    }
}

export default LoginController;