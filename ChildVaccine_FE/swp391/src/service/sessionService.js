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
    
            const response = await fetch(`${API_BASE_URL}/auth/customer/session-info`, {
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
    
    async checkStaffSession() {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No token found in localStorage');
          return { success: false, message: 'No authentication token found' };
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/staff/session-info`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          const errorStatus = response.status;
          const errorText = await response.text();
          
          console.error("Staff session check failed:", {
            status: errorStatus,
            message: errorText || `Session invalid (Status: ${errorStatus})`
          });
          
          // Auto logout on session failure
          console.log("🚨 Staff session invalid or expired! Logging out automatically...");
          this.syncLogout();
          
          return { success: false, message: errorText || 'Session validation failed' };
        }
        
        // API trả về đối tượng staff với thông tin user bên trong
        const staffData = await response.json();
        
        // Kiểm tra tính hợp lệ của dữ liệu
        if (!staffData || !staffData.id || !staffData.user || staffData.user.role !== 'STAFF') {
          console.error('Invalid staff data returned or not a staff role');
          return { success: false, message: 'Invalid staff data or role' };
        }
        
        console.log("✅ Staff session verified:", staffData);
        
        // Format lại response để phù hợp với cấu trúc dùng trong hệ thống
        return {
          success: true,
          message: 'Staff session active',
          body: {
            staffId: staffData.id,
            userId: staffData.user.id,
            email: staffData.user.email,
            fullName: staffData.user.fullName,
            phone: staffData.user.phone,
            department: staffData.department,
            role: staffData.user.role,
            qualification: staffData.qualification,
            specialization: staffData.specialization
          }
        };
      } catch (error) {
        console.error('Error checking staff session:', error);
        return { success: false, message: error.message };
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
}

export default new SessionService();
