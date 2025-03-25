const API_BASE_URL = 'http://localhost:8080/vaccinatecenter/api';

class SessionService {
    constructor() {
        this.authChannel = new BroadcastChannel('auth_channel');
        this.setupListeners();
    }

    setupListeners() {
        this.authChannel.onmessage = (event) => {
            switch (event.data.type) {
                case 'LOGIN':
                    this.syncLogin(event.data.session);
                    break;
                case 'LOGOUT':
                    this.syncLogout();
                    break;
                case 'SESSION_CHECK':
                    this.broadcastSessionStatus();
                    break;
                default:
                    console.warn('Unknown message type:', event.data.type);
                    break;
            }
        };

        window.addEventListener('storage', this.handleStorageChange.bind(this));
    }

    async checkSession() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.warn("No token found, user might not be logged in.");
                // Auto logout if no token found
                this.syncLogout();
                throw new Error("No authentication token found");
            }
    
            console.log("Checking session with token:", token.substring(0, 10) + "...");
    
            const response = await fetch(`${API_BASE_URL}/auth/session-info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorStatus = response.status;
                const errorText = await response.text();
                
                console.error("Session check failed:", {
                    status: errorStatus,
                    message: errorText || `Session invalid (Status: ${errorStatus})`
                });
                
                // Handle unauthorized (401), forbidden (403) or any other error by logging out
                console.log("🚨 Session invalid or expired! Logging out automatically...");
                this.syncLogout();
                
                throw new Error(errorText || "Failed to fetch session info");
            }
    
            const sessionData = await response.json();
    
            // Format the data to match login response
            const formattedSession = {
                headers: {},
                body: {
                    user: sessionData.user,
                    token: token,
                    cusId: sessionData.cusId,
                    address: sessionData.address,
                    dateOfBirth: sessionData.dateOfBirth,
                    gender: sessionData.gender
                },
                statusCode: "OK",
                statusCodeValue: 200
            };
    
            console.log("Session data received:", formattedSession);
            return formattedSession;
        } catch (error) {
            console.error('Session check failed:', {
                message: error.message,
                stack: error.stack
            });
            
            // If we haven't already logged out from a specific error case above,
            // do it here as a fallback for any other error
            if (error.message !== "No authentication token found") {
                console.log("🚨 Session check failed with unexpected error! Logging out...");
                this.syncLogout();
            }
            
            throw error;
        }
    }
    
    
    saveSession(sessionData) {
        if (!sessionData?.body) return;
        
        try {
            localStorage.setItem('sessionData', JSON.stringify({
                data: sessionData,
                timestamp: new Date().getTime()
            }));
            
            // Don't override existing token from login
            if (!localStorage.getItem('authToken') && sessionData.body.token) {
                localStorage.setItem('authToken', sessionData.body.token);
            }
    
            this.authChannel.postMessage({
                type: 'SESSION_UPDATE',
                session: sessionData
            });
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }

    clearSession() {
        console.log("🚨 clearSession() đã được gọi! Xóa token, user và sessionData khỏi localStorage.");
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionData');
        localStorage.removeItem('user'); // Add this line to remove user data
        this.broadcastSessionUpdate(null);
    }
    

    broadcastSessionUpdate(sessionData) {
        this.authChannel.postMessage({
            type: sessionData ? 'LOGIN' : 'LOGOUT',
            session: sessionData
        });
    }

    handleStorageChange(event) {
        if (event.key === 'authToken' && !event.newValue) {
            this.syncLogout();
        } else if (event.key === 'sessionData') {
            if (!event.newValue) {
                this.syncLogout();
            } else {
                window.location.reload();
            }
        }
    }

    syncLogin(sessionData) {
        if (sessionData?.body?.user) {
            this.saveSession(sessionData);
            if (window.location.pathname === '/login') {
                const role = sessionData.body.user.role;
                if (role === 'CUSTOMER') {
                    window.location.href = '/';
                } else if (role === 'STAFF') {
                    window.location.href = '/staff';
                } else if (role === 'ADMIN') {
                    window.location.href = '/admin';
                }
            } else {
                window.location.reload();
            }
        }
    }

    syncLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionData');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    broadcastSessionStatus() {
        const sessionData = localStorage.getItem('sessionData');
        if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            this.broadcastSessionUpdate(parsedSession.data);
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem('authToken');
        const sessionData = localStorage.getItem('sessionData');
        return !!(token && sessionData);
    }

        // sessionService.js - thêm phương thức này nếu chưa có
    async checkStaffSession() {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No token found in localStorage');
          return null;
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/staff/session-info`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Phiên đăng nhập đã hết hạn');
        }
        
        // Kiểm tra xem người dùng có role là STAFF không
        if (data.body && data.body.role === 'STAFF') {
          return data;
        } else {
          throw new Error('Phiên đăng nhập không hợp lệ cho nhân viên');
        }
      } catch (error) {
        console.error('Error checking staff session:', error);
        throw error;
      }
    }
}

export default new SessionService();
