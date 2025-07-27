// Manages the application state including current view, user data, and JWT token
class AppState {
    constructor() {
        this.currentView = 'login';  // Track which view is currently displayed
        this.user = null;            // Store user data once logged in
        this.jwt = localStorage.getItem('jwt');  // Load saved token from localStorage
    }

    // Switch between different views (login, dashboard, etc.)
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show requested view
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }
    }

    // Save JWT token to state and localStorage
    setToken(token) {
        this.jwt = token;
        localStorage.setItem('jwt', token);
    }

    // Remove JWT token from state and localStorage
    clearToken() {
        this.jwt = null;
        localStorage.removeItem('jwt');
    }

    // Extract user ID from JWT token payload
    getUserIdFromToken() {
        if (!this.jwt) return null;
        try {
            const payload = JSON.parse(atob(this.jwt.split(".")[1]));
            return payload.sub;
        } catch (e) {
            console.error("Invalid token:", e);
            return null;
        }
    }
}

export default AppState;