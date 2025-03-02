const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const reactionService = {
    // createReaction: async (reactionData) => {
    //     try {
    //         const token = localStorage.getItem('token');
            
    //         // Map frontend severity values to database values
    //         const severityMapping = {
    //             'LIGHT': 'MILD',
    //             'MEDIUM': 'MODERATE',
    //             'SEVERE': 'SEVERE'
    //         };

    //         // Format the data according to the database schema
    //         const formattedData = {
    //             childId: reactionData.childId,
    //             appointmentId: reactionData.appointmentId,
    //             symptoms: reactionData.symptoms,
    //             severity: severityMapping[reactionData.severity] || reactionData.severity,
    //             reactionDate: new Date(reactionData.reactionDate).toISOString()
    //         };

    //         console.log('📝 Sending formatted reaction data:', formattedData);

    //         const response = await fetch(`${API_BASE_URL}/api/reactions`, {  // Removed /api/
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(formattedData)
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json().catch(() => null);
    //             console.error('Server response:', errorData);
    //             throw new Error(errorData?.message || 'Failed to create reaction');
    //         }

    //         const data = await response.json();
    //         console.log('✅ Reaction created successfully:', data);
    //         return data;
    //     } catch (error) {
    //         console.error('❌ Error creating reaction:', error);
    //         throw error;
    //     }
    // },

    createReaction: async (reactionData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Format the date to match the expected format
            const formattedData = {
                ...reactionData,
                reactionDate: new Date().toISOString()
            };

            console.log('Sending reaction data:', formattedData);

            const response = await fetch(`${API_BASE_URL}/api/reactions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server response:', errorData);
                throw new Error('Failed to create reaction');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in createReaction:', error);
            throw error;
        }
    },
    
    getAllReactions: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/reactions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reactions');
            }

            const data = await response.json();
            console.log('✅ Reactions fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Error fetching reactions:', error);
            throw error;
        }
    }
};

export default reactionService;