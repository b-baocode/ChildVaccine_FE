const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const paymentService = {
  createPayment: async (appointmentId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      console.log(`Creating payment for appointment: ${appointmentId}`);
      
      const response = await fetch(`${API_BASE_URL}/api/payment/create/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Payment request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Payment URL received:', data);
      return data.vnpayUrl; // Return the payment URL
      
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
};

export default paymentService;