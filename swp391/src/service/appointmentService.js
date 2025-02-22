const API_BASE_URL = 'http://localhost:8080/vaccinatecenter'; // Port của Spring Boot

const appointmentService = {
// Đăng ký tiêm chủng
  createAppointment: async (appointmentData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/appointment/register-vaccination`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            throw new Error('Failed to create appointment');
        }

        return await response.json();
      } catch (error) {
          console.error('Error creating appointment:', error);
          throw error;
      }
  }
}

export default appointmentService;
