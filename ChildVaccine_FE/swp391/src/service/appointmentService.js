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

    getAppointmentById: async (appointmentId) => {
        try {
          const token = localStorage.getItem('authToken');
          
          const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch appointment: ${response.status}`);
          }
          
          return await response.json();
        } catch (error) {
          console.error('Error fetching appointment details:', error);
          throw error;
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

    getLatedAppointmentsByChildId: async (childId) => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${API_BASE_URL}/appointment/latest-appointment/${childId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          if (!response.ok) {
            if (response.status === 404) {
              // Không tìm thấy cuộc hẹn nào
              return null;
            }
            throw new Error('Không thể lấy thông tin cuộc hẹn gần nhất');
          }
      
          const data = await response.json();
          return data; // API trả về trực tiếp cuộc hẹn mới nhất
        } catch (error) {
          console.error('Error fetching latest appointment:', error);
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
            
            // Add excludeStatuses parameter to the API request
            const response = await fetch(
                `${API_BASE_URL}/appointment/availability?date=${date}&timeSlot=${formattedTime}&excludeCompleted=true&excludeCancelled=true`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 409) {
                    return {
                        available: false,
                        isFull: true,
                        maxAllowed: 0,
                        currentCount: 0,
                        remainingSlots: 0,
                        message: errorData.message || 'Slot is already full'
                    };
                }
                throw new Error(errorData.message || 'Failed to check slot availability');
            }
    
            const data = await response.json();
            console.log('✅ Slot availability response:', data);
            
            return {
                ...data,
                available: data.currentCount < data.maxAllowed,
                isFull: data.currentCount >= data.maxAllowed,
                remainingSlots: Math.max(0, data.maxAllowed - data.currentCount)
            };
        } catch (error) {
            console.error('❌ Error checking slot availability:', error);
            throw error;
        }
    },
    getAppointmentsByScheduleId: async (scheduleId) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log(`📡 Fetching appointments for schedule: ${scheduleId}`);

            const response = await fetch(`${API_BASE_URL}/appointment/schedule/${scheduleId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch schedule appointments: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Successfully fetched schedule appointments:', data);
            return { 
                ok: true, 
                appointments: data 
            };
        } catch (error) {
            console.error('❌ Error fetching schedule appointments:', {
                message: error.message,
                stack: error.stack
            });
            return { 
                ok: false, 
                message: error.message 
            };
        }
    },

    // Sửa lại trong appointmentService.js
    updatePaymentStatus: async (appointmentId) => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${API_BASE_URL}/appointment/update-payment-status/${appointmentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.error || 'Failed to update payment status');
        }
    
        return {
          ok: true,
          message: 'Successfully updated payment status',
          appointment: data
        };
      } catch (error) {
        console.error('Error updating payment status:', error);
        return {ok: false, message: error.message};
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

    rescheduleAppointment: async (appointmentId, newDate, newTime) => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${API_BASE_URL}/appointment/reschedule-appointment/${appointmentId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              newDate: newDate,
              newTime: newTime
            })
          });
          console.log('Reschedule appointment response:', response);
      
          if (!response.ok) {
            const errorData = await response.json();
            return { ok: false, message: errorData.message || 'Không thể dời lịch hẹn' };
          }
      
        //   const data = await response.json();
        //   console.log('Rescheduled appointment:', data);
          return { ok: true };
        } catch (error) {
          console.error('Error rescheduling appointment:', error);
          return { ok: false, message: error.message || 'Đã xảy ra lỗi khi dời lịch hẹn' };
        }
    }
};

export default appointmentService;