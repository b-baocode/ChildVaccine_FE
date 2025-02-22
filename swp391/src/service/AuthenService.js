const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/api/auth';

const authService = {
    login: async (credentials) => {
        try {
            console.log('Sending login request:', credentials); // Add this to debug
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            console.log('Login response data:', data); // Add this to debug
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (registerData) => {
        try {
            console.log('Sending register request:', registerData); // Debug log
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Email đã tồn tại trong hệ thống');
            }

            const data = await response.text();
            console.log('Register response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return await response.text();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};

export default authService;