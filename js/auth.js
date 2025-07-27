// Handles user authentication with the API
class AuthService {
    // Authenticate user with identifier (email/username) and password
    static async login(identifier, password) {
        // Encode credentials in base64 for Basic Authentication
        const encoded = btoa(`${identifier}:${password}`);
        console.log("Authorization header:", `Basic ${encoded}`);

        // Send login request to API
        const res = await fetch("https://learn.reboot01.com/api/auth/signin  ", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${encoded}`
            }
        });

        console.log("Response status:", res.status);

        // Handle failed authentication
        if (!res.ok) {
            const text = await res.text();
            console.error("Login error response:", text);
            throw new Error("Invalid credentials.");
        }

        // Parse and validate the JWT token response
        const token = await res.json();

        if (!token || typeof token !== "string") {
            throw new Error("No token received from server.");
        }

        // Basic JWT format validation (should start with "ey")
        if (!token.startsWith("ey")) {
            console.error("Invalid token format:", token);
            throw new Error("Received invalid token. Possible authentication failure.");
        }

        return token;
    }
}

export default AuthService;