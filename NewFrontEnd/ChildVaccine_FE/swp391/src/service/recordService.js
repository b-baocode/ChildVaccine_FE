const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const recordService = {
    createRecord: async (recordData) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('📝 Sending record data:', recordData);

            const response = await fetch(`${API_BASE_URL}/api/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recordData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create record');
            }

            const data = await response.json();
            console.log('✅ Record created successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Error creating record:', error);
            throw error;
        }
    },
    getRecordsByChildId: async (childId) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('🔍 Fetching vaccination records for child:', childId);

            const response = await fetch(`${API_BASE_URL}/api/records/${childId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch vaccination records');
            }

            const data = await response.json();
            console.log('✅ Vaccination records fetched:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching vaccination records:', error);
            throw error;
        }
    },
        // In recordService.js
    getAllRecords: async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${API_BASE_URL}/api/records`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
    
        return await response.json();
      } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
      }
    },
    // Thêm vào file recordService.js
    getRecordByAppointmentId: async (appointmentId) => {
        try {
            const token = localStorage.getItem('authToken');
            
            const response = await fetch(`${API_BASE_URL}/api/records/by-appId/${appointmentId}`, {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            });
        
            const data = await response.json();
            console.log('🔍 Fetching record for appointment:', data);
            if (!response.ok) {
                // Nếu server trả về lỗi
                throw new Error(data.message || 'Không thể lấy thông tin record');
            }
        
            // Trả về thông tin record nếu thành công
            return {
                ok: true,
                record: data
            };
            } catch (error) {
            console.error(`Error fetching record for appointment ${appointmentId}:`, error);
            return {
                ok: false,
                message: error.message || 'Đã xảy ra lỗi khi lấy thông tin record'
            };
        }
    }
};

export default recordService;