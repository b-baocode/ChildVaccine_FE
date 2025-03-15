import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/admin';

const adminService = {
    getStaffCount: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/staff/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Staff count response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error in getStaffCount:', error.response || error);
            throw error;
        }
    },

    getTodayAppointmentsCount: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/appointments/today/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching today appointments:', error);
            throw error;
        }
    },

    getRevenue: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/revenue`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching today appointments:', error);
            throw error;
        }
    },
};

export default adminService;