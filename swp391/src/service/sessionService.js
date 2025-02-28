const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/api';

const sessionService = {
    checkSession: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("No token found, user might not be logged in.");
                throw new Error("No authentication token found");
            }

            console.log("Checking session with token:", token.substring(0, 10) + "..."); // Log partial token for security

            const response = await fetch(`${API_BASE_URL}/auth/session-info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Ensures cookies are sent if using sessions
            });

            if (!response.ok) {
                const errorText = await response.text();
                const errorStatus = response.status;
                const errorMessage = errorText || `Session invalid (Status: ${errorStatus})`;
                console.error("Session check failed:", {
                    status: errorStatus,
                    message: errorMessage,
                    responseText: errorText
                });
                throw new Error(errorMessage);
            }

            const sessionData = await response.json();
            console.log("Session data received:", sessionData);
            return sessionData;
        } catch (error) {
            console.error('Session check failed:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    getSession: async () => {
        return await sessionService.checkSession();
      }
};

export default sessionService;