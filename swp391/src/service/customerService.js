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