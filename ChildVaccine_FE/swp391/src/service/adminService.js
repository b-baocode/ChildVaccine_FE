import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/admin';

const adminService = {
    getStaffCount: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/staff/count`);
            console.log('Staff count response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Staff count error:', error);
            throw error;
        }
    },

    getTodayAppointmentsCount: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/appointments/today/count`);
            console.log('Appointments response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Appointments error:', error);
            throw error;
        }
    },

    getRevenue: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/revenue`);
            console.log('Revenue response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Revenue error:', error);
            throw error;
        }
    },

    getAllStaffs: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/staffs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching staff:', error);
            throw error;
        }
    },

    createStaff: async (staffData) => {
        try {
            // Format the data to match the backend CreateStaffRequest
            const formattedData = {
                email: staffData.email,
                fullName: staffData.fullName,
                password: staffData.password,
                phone: staffData.phone,
                department: staffData.department,
                hireDate: new Date().toISOString().split('T')[0], // Current date as hire date
                qualification: staffData.qualification,
                specialization: staffData.specialization
            };

            const response = await axios.post(`${API_BASE_URL}/staff/register`, formattedData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data);
            }
            throw new Error('Failed to create staff member');
        }
    },

    updateStaff: async (id, staffData) => {
        try {
            const formattedData = {
                fullName: staffData.fullName,
                email: staffData.email,
                phone: staffData.phone,
                department: staffData.department,
                qualification: staffData.qualification,
                specialization: staffData.specialization
            };
            
            const response = await axios.put(`${API_BASE_URL}/staff/update/${id}`, formattedData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data);
            }
            throw new Error('Failed to update staff member');
        }
    },

    deleteStaff: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/staff/delete/${id}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data);
            }
            throw new Error('Failed to delete staff member');
        }
    },

    getAllFeedbacks: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/feedbacks`);
            console.log('Feedback response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response || error); // Debug log
            throw new Error(error.response?.data || 'Could not fetch feedbacks');
        }
    },

    getAllSchedules: async () => {
        try {
            const response = await axios.get(`http://localhost:8080/vaccinatecenter/api/schedules`);
            console.log('API Response:', response.data); // Add logging
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error); // Detailed error logging
            throw error;
        }
    },

    getAppointmentsByScheduleId: async (scheduleId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${scheduleId}/appointments`);
            console.log('API Response:', response.data); // Add logging
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error); // Detailed error logging
            throw error;
        }
    },

    getRevenueByScheduleId: async (scheduleId) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/${scheduleId}/revenue`);
          console.log('Revenue API Response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Revenue API Error:', error.response || error);
          return 0; // Return 0 instead of throwing error
        }
      },
};

export default adminService;