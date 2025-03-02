const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/api';

const feedbackService = {
    submitFeedback: async (feedbackData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            // Format data according to the API requirements
            const formattedData = {
                appointmentId: feedbackData.appointmentId,
                rating: parseInt(feedbackData.rating),
                feedback: feedbackData.feedback?.trim() || null
            };
    
            console.log('Sending feedback data:', formattedData); // Debug log
    
            const response = await fetch(`${API_BASE_URL}/feedback/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedData),
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                const errorStatus = response.status;
                const contentType = response.headers.get('Content-Type') || 'unknown';
                console.error('Server response error:', {
                    status: errorStatus,
                    contentType: contentType,
                    body: errorText
                });
                throw new Error(`Failed to submit feedback: ${errorText || `Status ${errorStatus}`}`);
            }
    
            const result = await response.json();
            console.log('Feedback submitted successfully:', result);
            return result;
        } catch (error) {
            console.error('Error submitting feedback:', error);
            throw error;
        }
    },

    getPendingFeedback: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/feedback/getall`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                const errorStatus = response.status;
                const contentType = response.headers.get('Content-Type') || 'unknown';
                console.error('Server response error fetching pending feedback:', {
                    status: errorStatus,
                    contentType: contentType,
                    body: errorText
                });
                throw new Error(`Failed to fetch pending feedback: ${errorText || `Status ${errorStatus}`}`);
            }

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Expected JSON response, but got: ${text.substring(0, 100)}...`);
            }

            return await response.json(); // Return list of FeedbackDTOs
        } catch (error) {
            console.error('Error fetching pending feedback:', error);
            throw error;
        }
    }
};

export default feedbackService;