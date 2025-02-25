const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const customerService = {
    getCustomerProfile: async (userId) => {
        try {
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
            console.log('🔍 Fetching children for customer:', cusId);
            
            const response = await fetch(`${API_BASE_URL}/childrens/getByCusID/${cusId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch children profiles');
            }

            const data = await response.json();
            console.log('👶 Children Data Response:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching children:', error);
            throw error;
        }
    }
};

export default customerService;