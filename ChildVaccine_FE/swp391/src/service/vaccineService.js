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
  },

  getVaccinesByPackageId: async (packageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/vaccines-by-package/${packageId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching vaccines for package ${packageId}:`, error);
      throw error;
    }
  },

  // Thêm vào vaccineService.js
  updateVaccine: async (vaccineId, vaccineData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/update/${vaccineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(vaccineData)
      });
      
      if (!response.ok) {
        throw new Error(`Cập nhật không thành công: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi cập nhật vaccine:', error);
      throw error;
    }
  },

  changeVaccineQuantity: async (vaccineId, quantityData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/change-quantity/${vaccineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(quantityData)
      });
      
      if (!response.ok) {
        throw new Error(`Cập nhật số lượng không thành công: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng vaccine:', error);
      throw error;
    }
  },

  getVaccinesByName: async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/vaccines-by-name/${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`Không thể tìm kiếm vaccine: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi tìm kiếm vaccine theo tên:', error);
      throw error;
    }
  },

  createVaccine: async (vaccineData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(vaccineData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Tạo mới không thành công: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi tạo vaccine mới:', error);
      throw error;
    }
  }
  
};

export default vaccineService;