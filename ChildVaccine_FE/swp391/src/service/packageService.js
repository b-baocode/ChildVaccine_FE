const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';


const packageService = {
  getAllPackages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/vaccine-packages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy danh sách gói vaccine:", error);
      throw error;
    }
  },

 getPackageById: async (packageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vaccine-package/package/${packageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin gói vaccine:", error);
    throw error;
  }
 },

  searchPackages: async (name) => {
    try {
      // Vì API không có endpoint tìm kiếm riêng, lấy tất cả rồi lọc ở client
      const response = await fetch(`${API_BASE_URL}/vaccine/vaccine-packages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      const allPackages = await response.json();
      // Lọc các gói chứa từ khóa trong tên (không phân biệt hoa thường)
      const searchTerm = name.toLowerCase();
      return allPackages.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("Lỗi khi tìm kiếm gói vaccine:", error);
      throw error;
    }
  },

  createPackage: async (packageData) => {
   try {
    // Chuẩn bị dữ liệu theo đúng cấu trúc API yêu cầu
    const requestData = {
      name: packageData.name,
      description: packageData.description,
      available: 1, // Mặc định là available
      vaccineIds: packageData.vaccineIds
    };

    const response = await fetch(`${API_BASE_URL}/vaccine-package/create-package`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status}`);
    }

    return await response.json();
    } catch (error) {
     console.error("Lỗi khi tạo gói vaccine mới:", error);
     throw error;
    }
  },

  updatePackageVaccines: async (packageId, packageData) => {
    try {
      // Cấu trúc đúng theo yêu cầu API
      const requestData = {
        vaccineIds: packageData.vaccineIds,
        name: packageData.name,
        description: packageData.description
      };
  
      console.log("Dữ liệu gửi API update package:", requestData);
  
      const response = await fetch(`${API_BASE_URL}/vaccine-package/update-vaccines/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi cập nhật gói vaccine:", error);
      throw error;
    }
  },
  
  // Thêm phương thức để lấy các vaccine trong một gói
  getVaccinesInPackage: async (packageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/vaccines-by-package/${packageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vaccine trong gói:", error);
      throw error;
    }
  },
  
  // Phương thức để thay đổi trạng thái available của gói
  togglePackageAvailability: async (packageId, available) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccine/toggle-package/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ available }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái gói vaccine:", error);
      throw error;
    }
  }
};

export default packageService;