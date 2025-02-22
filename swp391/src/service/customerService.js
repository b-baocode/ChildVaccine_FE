const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const customerService = {
    // Lấy thông tin customer đang đăng nhập
    getCurrentCustomer: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers/first`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching current customer:', error);
        throw error;
      }
    },

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

          return await response.json();
      } catch (error) {
          console.error('Error fetching customer profile:', error);
          throw error;
      }
  },
  
    // Lấy danh sách hồ sơ trẻ của customer
    getCustomerChildren: async (customerId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/childrens/getByCusID/${customerId}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching customer children:', error);
        throw error;
      }
    }
  };
  
  export default customerService;