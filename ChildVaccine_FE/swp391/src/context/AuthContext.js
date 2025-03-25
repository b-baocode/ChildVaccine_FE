import React, { createContext, useState, useEffect } from 'react';
import authService from '../service/AuthenService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Kiểm tra và xóa dữ liệu không nhất quán trước khi khởi tạo state
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    // Xóa loggedInCustomer cũ và chuyển sang user nếu cần
    const oldCustomerData = localStorage.getItem('loggedInCustomer');
    if (oldCustomerData && !storedUser) {
        console.log('🔄 Di chuyển dữ liệu từ loggedInCustomer sang user');
        localStorage.setItem('user', oldCustomerData);
        localStorage.removeItem('loggedInCustomer');
    }
    
    // Xóa dữ liệu không nhất quán
    if (!storedToken && storedUser) {
        console.log('⚠️ Phát hiện trạng thái không nhất quán: có user nhưng không có token');
        localStorage.removeItem('user');
    }
    
    // Khởi tạo state sau khi đã xử lý tính nhất quán
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const [user, setUser] = useState(parsedUser);
    const [token, setToken] = useState(storedToken);
    
    console.log('🔍 AuthContext - Khởi tạo với:', { 
        token: token ? 'Có token' : 'Không có token', 
        user: user ? user.role : 'null' 
    });

    useEffect(() => {
        const syncAuthState = () => {
            const currentToken = localStorage.getItem('authToken');
            const currentUserData = localStorage.getItem('user');
            
            console.log('🔄 Đồng bộ trạng thái xác thực:', {
                tokenExists: Boolean(currentToken),
                userDataExists: Boolean(currentUserData)
            });
            
            // Xử lý tính nhất quán
            if (!currentToken && currentUserData) {
                console.log('🔄 Phát hiện không nhất quán - xóa dữ liệu người dùng');
                localStorage.removeItem('user');
                setUser(null);
                return;
            }
            
            // Cập nhật state dựa trên localStorage
            if (currentToken) {
                try {
                    const parsedUserData = currentUserData ? JSON.parse(currentUserData) : null;
                    setToken(currentToken);
                    setUser(parsedUserData);
                } catch (error) {
                    console.error('❌ Lỗi phân tích dữ liệu người dùng:', error);
                    // Xóa dữ liệu lỗi
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                setToken(null);
                setUser(null);
            }
        };
        
        // Kiểm tra ngay khi component mount
        syncAuthState();
        
        // Xử lý sự kiện storage (cho đồng bộ giữa các tab)
        const handleStorageChange = (e) => {
            console.log('🔄 Phát hiện thay đổi storage:', e?.key);
            syncAuthState();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // const login = async (response) => {
    //     if (response.body?.token && response.body?.user) {
    //         localStorage.setItem("authToken", response.body.token);
    //         localStorage.setItem("loggedInCustomer", JSON.stringify(response.body.user));
    //         setUser(response.body.user);
    //         setToken(response.body.token);
    //         window.dispatchEvent(new Event("storage"));
    //     }
    // };

    const login = async (response) => {
        if (response.body?.token && response.body?.user) {
            // Lưu token
            localStorage.setItem("authToken", response.body.token);
            
            // Tạo và lưu user data
            const userData = {
                role: response.body.user.role,
                redirectUrl: response.body.redirectUrl || '/',
                fullName: response.body.user.fullName,
                id: response.body.user.id,
                email: response.body.user.email
            };
            
            // Lưu đúng vào 'user', không phải 'loggedInCustomer'
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Cập nhật state
            setUser(userData);
            setToken(response.body.token);
            
            console.log('✅ Đăng nhập thành công:', {
                token: response.body.token.substring(0, 10) + '...',
                user: userData
            });
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            // Thorough cleanup
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('sessionData');
            localStorage.removeItem('loggedInCustomer'); // Add this line
            setUser(null);
            setToken(null);
            // Notify other tabs
            window.dispatchEvent(new Event("storage"));
        }
    };

    useEffect(() => {
        const checkTokenAndSync = () => {
            const currentToken = localStorage.getItem('authToken');
            const currentUser = localStorage.getItem('user');
            
            // If token is gone but user still exists, clear user
            if (!currentToken && currentUser) {
                console.log('🔄 Token missing but user exists, clearing user state');
                localStorage.removeItem('user');
                setUser(null);
            }
        };
        
        // Check on component mount
        checkTokenAndSync();
        
        // Set up storage event listener
        const handleStorageChange = (e) => {
            if (e.key === 'authToken' && !e.newValue) {
                console.log('🔄 Token removed in another tab, syncing user state');
                localStorage.removeItem('user');
                setUser(null);
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);