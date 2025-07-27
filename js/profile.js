// Controls the user profile view, data loading, display, and logout functionality
import GraphQLService from './graphql.js';
import DataProcessor from './data.js';
import ChartRenderer from './chart.js';

class ProfileController {
    constructor(appState) {
        this.appState = appState;
        this.userInfoElement = null;
        this.xpDisplayElement = null;
        this.gradesDisplayElement = null;
        this.logoutButton = null;
        
        // Initialize DOM elements and setup event listeners
        this.setupEventListeners();
        this.initializeElements();
    }

    // Get references to DOM elements
    initializeElements() {
        this.userInfoElement = document.getElementById("userInfo");
        this.xpDisplayElement = document.getElementById("xpDisplay");
        this.gradesDisplayElement = document.getElementById("gradesDisplay");
        this.logoutButton = document.getElementById("logoutBtn");
    }

    // Setup event listeners for interactive elements
    setupEventListeners() {
        // Setup logout button - use event delegation since button might not exist yet
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'logoutBtn') {
                this.handleLogout();
            }
        });
    }

    // Display loading indicators while data is being fetched
    showLoadingState() {
        if (this.userInfoElement) {
            this.userInfoElement.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                    <p>Loading your profile...</p>
                </div>
            `;
        }
        if (this.xpDisplayElement) {
            this.xpDisplayElement.innerHTML = '<p>Loading XP data...</p>';
        }
        if (this.gradesDisplayElement) {
            this.gradesDisplayElement.innerHTML = '<p>Loading project data...</p>';
        }
        // Show loading state for charts
        ChartRenderer.renderLoadingState("#graph1Container", "Loading XP chart...");
        ChartRenderer.renderLoadingState("#graph2Container", "Loading project chart...");
    }

    // Display error messages when data loading fails
    showErrorState(error) {
        if (this.userInfoElement) {
            this.userInfoElement.innerHTML = `
                <div style="color: #ff6b6b; text-align: center; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Please check the console for details or try logging in again.</p>
                    <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
        // Show error state for charts
        ChartRenderer.renderErrorState("#graph1Container", "Failed to load XP chart");
        ChartRenderer.renderErrorState("#graph2Container", "Failed to load project chart");
    }

    // Display user information in the profile view
    displayUserInfo(userData) {
        if (!this.userInfoElement || !userData.user || userData.user.length === 0) {
            console.error("No user data available");
            return;
        }
        const user = userData.user[0];
        const createdAt = DataProcessor.formatDate(user.createdAt);
        this.userInfoElement.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">👤</div>
                <h2 style="color: var(--secondary); margin: 0 0 15px;">Hello, ${user.login}!</h2>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left;">
                <div>
                    <p><strong>User ID:</strong> ${user.id}</p>
                    <p><strong>Username:</strong> ${user.login}</p>
                </div>
                <div>
                    <p><strong>Account Created:</strong> ${createdAt}</p>
                    <p><strong>Status:</strong> <span style="color: var(--secondary);">Active</span></p>
                </div>
            </div>
        `;
    }

    // Display user statistics (XP, projects)
    displayStats(stats) {
        if (!this.xpDisplayElement || !this.gradesDisplayElement) return;
        
        // Display total XP earned
        this.xpDisplayElement.innerHTML = `
            <div style="text-align: center; padding: 15px; background: rgba(106, 13, 173, 0.1); border-radius: 12px;">
                <div style="font-size: 32px; color: var(--secondary); font-weight: bold;">
                    ${DataProcessor.formatNumber(stats.totalXp)}
                </div>
                <p style="margin: 5px 0 0; color: var(--light);">Total XP Earned</p>
            </div>
        `;
        
        // Display project statistics (passed, failed, success rate)
        this.gradesDisplayElement.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center;">
                <div style="padding: 15px; background: rgba(212, 175, 55, 0.1); border-radius: 12px;">
                    <div style="font-size: 24px; color: var(--secondary); font-weight: bold;">${stats.pass}</div>
                    <p style="margin: 5px 0 0; font-size: 0.9rem;">Passed</p>
                </div>
                <div style="padding: 15px; background: rgba(255, 107, 107, 0.1); border-radius: 12px;">
                    <div style="font-size: 24px; color: #ff6b6b; font-weight: bold;">${stats.fail}</div>
                    <p style="margin: 5px 0 0; font-size: 0.9rem;">Failed</p>
                </div>
                <div style="padding: 15px; background: rgba(106, 13, 173, 0.1); border-radius: 12px;">
                    <div style="font-size: 24px; color: var(--primary); font-weight: bold;">${stats.successRate}%</div>
                    <p style="margin: 5px 0 0; font-size: 0.9rem;">Success Rate</p>
                </div>
            </div>
        `;
    }

    // Main method to load and display user profile data
    async loadProfile() {
        console.log("Loading profile data...");
        
        // Check authentication
        if (!this.appState.jwt) {
            console.log("No JWT found, redirecting to login");
            alert("Not authenticated. Please log in.");
            this.appState.showView('login');
            return;
        }
        
        // Get user ID from token
        const userId = this.appState.getUserIdFromToken();
        console.log("Decoded user ID:", userId);
        if (!userId) {
            this.showErrorState(new Error("Could not read user ID from token"));
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        try {
            console.log("Fetching user data from GraphQL...");
            const userData = await GraphQLService.fetchUserProfile(this.appState.jwt, userId);
            console.log("GraphQL response received:", userData);
            
            // Validate response
            if (!userData || !userData.user || userData.user.length === 0) {
                throw new Error("No user data received from server");
            }
            
            // Process and display data
            const stats = DataProcessor.calculateStats(userData);
            this.displayUserInfo(userData);
            this.displayStats(stats);
            console.log("Profile data loaded successfully");
            console.log("Progress data:", userData.progress);
            console.log("XP transactions:", userData.transactions.nodes?.length || 0);
            
            // Render charts
            this.renderCharts(userData, stats);
            
        } catch (err) {
            console.error("Failed to load profile:", err);
            this.showErrorState(err);
            
            // If token is invalid, redirect to login
            if (err.message.includes("Unauthorized") || err.message.includes("token")) {
                setTimeout(() => {
                    this.appState.clearToken();
                    this.appState.showView('login');
                }, 3000);
            }
        }
    }

    // Render charts using the loaded data
    renderCharts(userData, stats) {
        try {
            // Render XP over time chart
            if (userData.transactions && userData.transactions.nodes) {
                ChartRenderer.renderXpOverTimeGraph(userData.transactions.nodes, "#graph1Container");
            } else {
                ChartRenderer.renderErrorState("#graph1Container", "No XP transaction data available");
            }
            
            // Render pass/fail chart
            ChartRenderer.renderPassFailBarChart(stats.pass, stats.fail, "#graph2Container");
            
        } catch (err) {
            console.error("Error rendering charts:", err);
            ChartRenderer.renderErrorState("#graph1Container", "Error rendering XP chart");
            ChartRenderer.renderErrorState("#graph2Container", "Error rendering project chart");
        }
    }

    // Handle user logout
    handleLogout() {
        console.log("Logging out user");
        
        // Show confirmation dialog
        if (confirm("Are you sure you want to log out?")) {
            // Clear token and user data
            this.appState.clearToken();
            this.appState.user = null;
            
            // Reset profile view
            this.resetProfileView();
            
            // Redirect to login
            this.appState.showView('login');
            console.log("User logged out successfully");
        }
    }

    // Reset profile view to initial state
    resetProfileView() {
        // Clear all profile data
        if (this.userInfoElement) {
            this.userInfoElement.innerHTML = '<p>Loading user data...</p>';
        }
        if (this.xpDisplayElement) {
            this.xpDisplayElement.innerHTML = '';
        }
        if (this.gradesDisplayElement) {
            this.gradesDisplayElement.innerHTML = '';
        }
        
        // Clear charts
        const graph1 = document.querySelector("#graph1Container");
        const graph2 = document.querySelector("#graph2Container");
        if (graph1) graph1.innerHTML = '';
        if (graph2) graph2.innerHTML = '';
    }

    // Method to refresh profile data
    async refreshProfile() {
        console.log("Refreshing profile data...");
        await this.loadProfile();
    }
}

export default ProfileController;