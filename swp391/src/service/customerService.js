const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const customerService = {
    getCustomerProfile: async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/customers/${userId}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch customer profile');
            }

            const data = await response.json();
            console.log('📡 Customer Profile Response:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching customer profile:', error);
            throw error;
        }
    },
    
    getCustomerChildren: async (cusId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return [];
    
            const response = await fetch(`${API_BASE_URL}/childrens/getByCusID/${cusId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            // Return empty array for any non-successful response
            if (!response.ok) return [];
    
            const text = await response.text();
            if (!text) return [];
    
            try {
                const data = JSON.parse(text);
                return Array.isArray(data) ? data : [];
            } catch (error) {
                return [];
            }
        } catch (error) {
            return [];
        }
    }
};

export default customerService;