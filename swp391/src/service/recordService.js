const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const recordService = {
    createRecord: async (recordData) => {
        try {
            const token = localStorage.getItem('token');
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
    }
};

export default recordService;