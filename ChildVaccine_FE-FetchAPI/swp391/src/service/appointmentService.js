const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const appointmentService = {
    registerVaccination: async (registrationData) => {
        try {
            const token = localStorage.getItem('authToken');
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
            const token = localStorage.getItem('authToken');
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

    getAppointmentsByChildId: async (childId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/appointment/byChild/${childId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('📡 Child Appointments Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: data
            });

            if (!response.ok) {
                if (response.status === 204) {
                    return []; // Return empty array for no content
                }
                throw new Error('Failed to fetch child appointments');
            }

            console.log('✅ Successfully Fetched Child Appointments:', data);
            return data;
        } catch (error) {
            console.error('❌ Error Fetching Child Appointments:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    updateAppointmentStatus: async (appId, status) => {
        try {
            const token = localStorage.getItem('authToken');
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

    // Cập nhật để lấy danh sách từ server thay vì localStorage
    getPendingFeedbackAppointment: async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.warn('No token found, user might not be logged in.');
                return [];
            }

            console.log('Fetching pending feedback with token:', token.substring(0, 10) + '...'); // Log để debug

            const response = await fetch(`${API_BASE_URL}/appointment/completed-without-feedback`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error for pending feedback:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                throw new Error('Failed to fetch pending feedback appointments');
            }

            const data = await response.json();
            console.log('📡 Pending Feedback Appointments Response (Raw):', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: data,
            });

            // Đảm bảo data là mảng, nếu không trả về mảng rỗng
            const normalizedData = Array.isArray(data) ? data : [];
            console.log('✅ Successfully Fetched Pending Feedback Appointments (Normalized):', normalizedData);

            // Kiểm tra định dạng cusId trong dữ liệu
            normalizedData.forEach((appt, index) => {
                console.log(`Appointment ${index + 1} cusId:`, appt.cusId, 'Type:', typeof appt.cusId);
            });

            return normalizedData;
        } catch (error) {
            console.error('❌ Error Fetching Pending Feedback Appointments:', {
                message: error.message,
                stack: error.stack,
            });
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    },

    clearPendingFeedback: () => {
        localStorage.removeItem('pendingFeedback');
    },

    getCompletedAppointmentsWithoutFeedback: async () => {
        return await appointmentService.getPendingFeedbackAppointment();
    },

    getAppointmentsByCustomerId: async (customerId) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('📡 Fetching appointments for customer:', customerId);

            const response = await fetch(`${API_BASE_URL}/appointment/byCustomer/${customerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            console.log('✅ Successfully fetched customer appointments:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching customer appointments:', error);
            throw error;
        }
    },

    checkSlotAvailability: async (date, timeSlot) => {
        try {
            const formattedTime = `${timeSlot.substring(0, 2)}:${timeSlot.substring(2)}:00`;
            const token = localStorage.getItem('authToken');
            
            console.log('📡 Checking slot availability:', { date, timeSlot: formattedTime });
            
            const response = await fetch(
                `${API_BASE_URL}/appointment/availability?date=${date}&timeSlot=${formattedTime}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('slot is full');
            }

            const data = await response.json();
            console.log('✅ Slot availability response:', data);
            
            return {
                ...data,
                isFull: data.currentCount >= data.maxAllowed,
                remainingSlots: Math.max(0, data.maxAllowed - data.currentCount)
            };
        } catch (error) {
            console.error('❌ Error checking slot availability:', error);
            throw error;
        }
    }

};

export default appointmentService;