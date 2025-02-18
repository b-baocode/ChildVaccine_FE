const API_BASE_URL = 'http://localhost:8080/vaccinatecenter'; // Port của Spring Boot

const childService = {
    // Lấy danh sách hồ sơ trẻ của customer
    getCustomerChildren: async (customerId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/customers/${customerId}/children`);
          return await response.json();
        } catch (error) {
          console.error('Error fetching customer children:', error);
          throw error;
        }
    }
}

export default childService;