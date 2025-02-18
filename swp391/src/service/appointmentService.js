const API_BASE_URL = 'http://localhost:8080/vaccinatecenter'; // Port của Spring Boot

const appointmentService = {
// Đăng ký tiêm chủng
  registerVaccination: async (registrationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointment/register-vaccination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error registering vaccination:', error);
      throw error;
    }
  }
}

export default appointmentService;
