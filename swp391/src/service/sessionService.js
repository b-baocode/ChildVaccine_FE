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
                throw new Error("No authentication token found");
            }
    
            console.log("Checking session with token:", token.substring(0, 10) + "..."); // Log partial token for security
    
            const response = await fetch(`${API_BASE_URL}/auth/session-info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Giữ lại nếu backend sử dụng session
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                const errorStatus = response.status;
                console.error("Session check failed:", {
                    status: errorStatus,
                    message: errorText || `Session invalid (Status: ${errorStatus})`
                });
                throw new Error(errorText || "Failed to fetch session info");
            }
    
            const sessionData = await response.json();
    
            // Định dạng lại dữ liệu để giống login response
            const formattedSession = {
                headers: {},
                body: {
                    user: sessionData.user, // Đối tượng user
                    token: token, // Giữ lại token
                    cusId: sessionData.cusId, // ID khách hàng
                    address: sessionData.address, // Địa chỉ khách hàng
                    dateOfBirth: sessionData.dateOfBirth, // Ngày sinh
                    gender: sessionData.gender // Giới tính
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
            throw error;
        }
    };
    
    
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
        console.log("🚨 clearSession() đã được gọi! Xóa token và sessionData khỏi localStorage.");
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionData');
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
        window.location.href = '/login';
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