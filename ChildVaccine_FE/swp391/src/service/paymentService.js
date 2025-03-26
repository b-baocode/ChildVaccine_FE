const API_BASE_URL = 'http://localhost:8080/vaccinatecenter';

const paymentService = {
  // createPayment: async (appointmentId) => {
  //   try {
  //     const token = localStorage.getItem('authToken');
      
  //     console.log(`Creating payment for appointment: ${appointmentId}`);
      
  //     const response = await fetch(`${API_BASE_URL}/api/payment/create/${appointmentId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
      
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(errorText || `Payment request failed with status ${response.status}`);
  //     }
      
  //     const data = await response.json();
  //     console.log('Payment URL received:', data);
  //     return data.vnpayUrl; // Return the payment URL
      
  //   } catch (error) {
  //     console.error('Error creating payment:', error);
  //     throw error;
  //   }
  // },

  createPayment: async (appointmentId, scheduleId, payFull = false) => {
    try {
      // Kiểm tra xem có đủ thông tin không
      if (!appointmentId || !scheduleId) {
        throw new Error('Thiếu thông tin: cần cung cấp cả scheduleId và appointmentId');
      }
  
      // Chuẩn bị dữ liệu gửi đi - luôn gửi cả hai thông tin
      const requestBody = {
        appointmentId: appointmentId,
        scheduleId: scheduleId,
        payFull: payFull
      };
      
      console.log("Payment request data:", requestBody);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/payment/create-payment`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể tạo thanh toán');
      }
      
      const data = await response.json();
      console.log('Payment response:', data);
      
      // Trả về URL thanh toán hoặc kết quả thành công
      return data.paymentUrl || data.vnpayUrl || data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
};

export default paymentService;