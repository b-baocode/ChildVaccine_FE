const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const feedbackService = {
    submitFeedback: async (feedbackData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/feedback/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            return await response.json();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            throw error;
        }
    },

    getPendingFeedback: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/feedback/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pending feedback');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching pending feedback:', error);
            throw error;
        }
    }
};

export default feedbackService;