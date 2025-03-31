const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/api/auth';

const authService = {
    login: async (credentials) => {
        try {
            console.log('🔵 Sending login request:', credentials);
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            console.log('🟢 Login response data:', data);

            if (data.body?.token && data.body?.user) {
                // Lưu token & user vào localStorage
                localStorage.setItem('authToken', data.body.token);
                localStorage.setItem('loggedInCustomer', JSON.stringify(data.body.user));

                // Kiểm tra lại xem có lưu thành công không
                console.log("🔴 Token saved in localStorage:", localStorage.getItem("authToken"));
                console.log("🟠 User saved in localStorage:", localStorage.getItem("loggedInCustomer"));

                // Cập nhật trạng thái trên các tab
                window.dispatchEvent(new Event("storage"));
            }

            return data;
        } catch (error) {
            console.error('🔴 Login error:', error);
            throw error;
        }
    },

    getToken: () => localStorage.getItem('authToken'),
    getUser: () => JSON.parse(localStorage.getItem('loggedInCustomer')),
  
    logout: () => {
        console.log("🚨 logout() đã được gọi! Xóa token và user khỏi localStorage.");
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedInCustomer');
        window.dispatchEvent(new Event("storage"));
    },
    

    register: async (registerData) => {
        try {
            console.log('Sending register request:', registerData); // Debug log
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });
            console.log('Register response:', response); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Email đã tồn tại trong hệ thống');
            }

            const data = await response.text();
            console.log('Register response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },
    
    requestOtp: async (email) => {
        try {
            console.log('📨 Requesting OTP for email:', email);
            
            // Create form data
            const formData = new URLSearchParams();
            formData.append('email', email);

            const response = await fetch(`${API_BASE_URL}/request-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('📡 OTP Request Response:', errorText);
                
                if (response.status === 404) {
                    throw new Error('Email không tồn tại!');
                }
                throw new Error(errorText || 'Không thể gửi mã OTP');
            }

            const responseText = await response.text();
            console.log('✅ OTP request successful:', responseText);
            return responseText;
        } catch (error) {
            console.error('❌ OTP Request Error:', error);
            throw error;
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            console.log('🔍 Verifying OTP for:', { email, otp });
            
            // Create form data
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('otp', otp);
    
            const response = await fetch(`${API_BASE_URL}/validate-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });
    
            const responseText = await response.text();
            console.log('📡 OTP Verification Response:', responseText);
    
            if (!response.ok) {
                throw new Error(responseText || 'Mã OTP không hợp lệ');
            }
    
            return {
                ok: true,
                message: responseText
            };
        } catch (error) {
            console.error('❌ OTP Verification Error:', error);
            return {
                ok: false,
                error: error.message
            };
        }
    },

    resetPassword: async (email, otp, newPassword) => {
        try {
            console.log('🔑 Resetting password for:', email);
            
            // Create form data
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('otp', otp);
            formData.append('newPassword', newPassword);
    
            const response = await fetch(`${API_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });
    
            const responseText = await response.text();
            console.log('📡 Password Reset Response:', responseText);
    
            if (!response.ok) {
                throw new Error(responseText || 'Không thể đặt lại mật khẩu');
            }
    
            return { 
                ok: true, 
                message: responseText 
            };
        } catch (error) {
            console.error('❌ Password Reset Error:', error);
            return { 
                ok: false, 
                error: error.message 
            };
        }
    }
};

export default authService;