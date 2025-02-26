const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const appointmentService = {
    registerVaccination: async (registrationData) => {
        try {
            const token = localStorage.getItem('token');
            console.log('🚀 Sending Registration Data:', {
                ...registrationData,
                token: token ? 'Bearer Token exists' : 'No token found'
            });

            const response = await fetch(`${API_BASE_URL}/appointment/register-vaccination`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            const data = await response.json();
            console.log('📡 API Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: data
            });

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            console.log('✅ Registration Successful:', {
                message: data.message,
                appointment: data.appointment
            });
            return { 
                ok: true, 
                message: data.message, 
                appointment: data.appointment 
            };
        } catch (error) {
            console.error('❌ Registration Error:', {
                message: error.message,
                stack: error.stack
            });
            return { ok: false, error: error.message };
        }
    },

    getAllAppointments: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/appointment/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('📡 All Appointments Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: data
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            console.log('✅ Successfully Fetched Appointments:', data);
            return data; // Trả về danh sách appointments
        } catch (error) {
            console.error('❌ Error Fetching Appointments:', {
                message: error.message,
                stack: error.stack
            });
            throw error; // Ném lỗi để component xử lý
        }
    },
    updateAppointmentStatus: async (appId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/appointment/update-status/${appId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();
            console.log('📡 Update Status Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: data,
            });

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update status');
            }

            // Nếu status là COMPLETED, lưu thông tin để trigger feedback
            if (status === 'COMPLETED') {
                localStorage.setItem('pendingFeedback', JSON.stringify({
                    appointmentId: appId,
                    appointmentInfo: data.appointment
                }));
            }

            console.log('✅ Status Updated Successfully:', data);
            return data.appointment;
        } catch (error) {
            console.error('❌ Error Updating Status:', {
                message: error.message,
                stack: error.stack,
            });
            throw error;
        }
    },

    // Thêm methods để quản lý pending feedback
    getPendingFeedbackAppointment: async () => {
        try {
            return JSON.parse(localStorage.getItem('pendingFeedback'));
        } catch (error) {
            return null;
        }
    },

    clearPendingFeedback: () => {
        localStorage.removeItem('pendingFeedback');
    },

    getCompletedAppointmentsWithoutFeedback: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/appointment/completed-without-feedback`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            console.log('📡 Completed Appointments Without Feedback Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: data,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch completed appointments without feedback');
            }

            console.log('✅ Successfully Fetched Completed Appointments Without Feedback:', data);
            return data;
        } catch (error) {
            console.error('❌ Error Fetching Completed Appointments Without Feedback:', {
                message: error.message,
                stack: error.stack,
            });
            return [];
        }
    },
    
};

export default appointmentService;