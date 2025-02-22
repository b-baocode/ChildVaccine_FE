const API_BASE_URL = 'http://localhost:8080/vaccinatecenter'; // Port của Spring Boot

const childService = {
    // Lấy danh sách hồ sơ trẻ của customer


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
        const response = await fetch(`${API_BASE_URL}/children/${childId}`, {
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
}

export default childService;