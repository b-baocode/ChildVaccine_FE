// src/service/sessionService.js
const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/api';

const sessionService = {
    checkSession: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/auth/session-info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'  // Quan trọng để gửi cookies
            });

            if (!response.ok) {
                throw new Error('Session invalid');
            }

            return await response.json();
        } catch (error) {
            console.error('Session check failed:', error);
            throw error;
        }
    }
};

export default sessionService;