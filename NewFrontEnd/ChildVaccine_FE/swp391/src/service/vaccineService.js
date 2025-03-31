// Tạo file mới: src/services/vaccineService.js

const API_BASE_URL = 'http://localhost:8080/vaccinatecenter'; // Port của Spring Boot

const vaccineService = {
  // Lấy danh sách vaccine
  getVaccines: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/vaccines`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      throw error;
    }
  },

  // Lấy danh sách gói vaccine
  getVaccinePackages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/vaccine-packages`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching vaccine packages:', error);
      throw error;
    }
  }
  
};

export default vaccineService;