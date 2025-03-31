const BASE_URL = 'http://localhost:8080/vaccinatecenter/api/schedules';

const scheduleService = {

    scheduleRegister : async (scheduleData) => {
        try{
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${BASE_URL}`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData)

            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Schedule create faild!');
            }

            return{
                ok: true,
                message: data.message,
                schedule: data.schedule
            }
        } catch (error) {
            return {ok: false, message: error.message}
        }
    },
    getAllSchedules: async () => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${BASE_URL}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch schedules');
            }

            return {
                ok: true,
                message: 'Successfully fetched schedules',
                schedules: data
            };
        } catch (error) {
            return {ok: false, message: error.message};
        }
    },

    getSchedulesByCustomerId: async (cusId) => {
        try {
            const token = localStorage.getItem('authToken');
            
            const response = await fetch(`${BASE_URL}/${cusId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch customer schedules');
            }

            return {
                ok: true,
                message: 'Successfully fetched customer schedules',
                schedules: data
            };
        } catch (error) {
            console.error('Error fetching customer schedules:', error);
            return {ok: false, message: error.message};
        }
    },

    getSchedulesByPhoneNumber: async (phoneNumber) => {
      try {
        const token = localStorage.getItem('authToken');
        if (!phoneNumber || phoneNumber.trim() === '') {
          return { ok: false, message: 'Vui lòng nhập số điện thoại' };
        }
    
        const response = await fetch(`${BASE_URL}/by-phone/${phoneNumber}`, {
          method: 'GET',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          return {
            ok: false,
            message: `Lỗi khi tìm kiếm lịch tiêm: ${response.status}`,
          };
        }
    
        const data = await response.json();
        return {
          ok: true,
          schedules: data,
        };
      } catch (error) {
        console.error('Error fetching schedules by phone number:', error);
        return {
          ok: false,
          message: error.message || 'Lỗi khi tìm kiếm lịch tiêm theo số điện thoại',
        };
      }
    },

    updateScheduleStatus: async (scheduleId, newStatus) => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${BASE_URL}/update-status/${scheduleId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.error || `Failed to update schedule status to ${newStatus}`);
        }
    
        return {
          ok: true,
          message: 'Successfully updated schedule status',
          schedule: data
        };
      } catch (error) {
        console.error('Error updating schedule status:', error);
        return {ok: false, message: error.message};
      }
    },

    getSchedulesByChildId: async (childId) => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${BASE_URL}/by-childId/${childId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch schedules');
        }
    
        return data;
      } catch (error) {
        console.error(`Error fetching schedules for child ${childId}:`, error);
        return [];
      }
    },

    updateStatusIfCompleted: async (scheduleId) => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${BASE_URL}/update-status-if-completed/${scheduleId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
      
          const data = await response.json();
          
          if (!response.ok) {
            return { ok: false, message: data.message || 'Failed to update schedule status' };
          }
      
          return { 
            ok: true, 
            updated: data.updated || false,
            message: data.message 
          };
        } catch (error) {
          console.error(`Error updating schedule status for ${scheduleId}:`, error);
          return { ok: false, message: 'Error updating schedule status' };
        }
    }
}

export default scheduleService;