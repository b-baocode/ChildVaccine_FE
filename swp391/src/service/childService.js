import sessionService from "./sessionService";

const API_BASE_URL = 'http://localhost:8080/vaccinatecenter'; // Port của Spring Boot

const childService = {
    addChildProfile: async (childData) => {
        try {
            const token = localStorage.getItem('token');
            const sessionData = await sessionService.checkSession();
            
            if (!sessionData || !sessionData.cusId) {
                throw new Error('Invalid session data');
            }
            
            const response = await fetch(`${API_BASE_URL}/children/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...childData,
                    customerId: sessionData.cusId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add child profile');
            }

            const data = await response.json();
            console.log('Child profile added:', data);
            return data;
        } catch (error) {
            console.error('Error in addChildProfile:', error);
            throw error;
        }
    },


  getCustomerChildren: async (customerId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch children list');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching customer children:', error);
        throw error;
    }
  },

  getChildProfile: async (childId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/childrens/${childId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch child profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching child profile:', error);
        throw error;
    }
  },

  getAllChildren: async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/childrens/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch children data');
        }

        return await response.json();
        } catch (error) {
            console.error('Error fetching children:', error);
            throw error;
        }
    }
}

export default childService;