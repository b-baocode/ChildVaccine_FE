import React, { createContext, useState, useContext, useEffect } from 'react';
import sessionService from '../service/sessionService';
import appointmentService from '../service/appointmentService'; // Import service để gọi API appointment

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null);
    const [pendingAppointments, setPendingAppointments] = useState([]); // Danh sách buổi hẹn chưa feedback
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            setIsLoading(true);
            try {
                const sessionData = await sessionService.checkSession();
                console.log('Session data received in checkSession:', sessionData); // Log để debug
                if (sessionData && sessionData.body && sessionData.body.cusId && sessionData.body.user) {
                    setSessionInfo(sessionData);
                    const cusId = sessionData.body.cusId; // Lấy cusId từ session (ví dụ: "CUS003")
                    console.log('Extracted cusId from session:', cusId); // Log để debug
                    setUser({
                        ...sessionData.body.user,
                        cusId: cusId, // Đảm bảo cusId là "CUS003"
                        address: sessionData.body.address || '',
                        dateOfBirth: sessionData.body.dateOfBirth || '',
                        gender: sessionData.body.gender || ''
                    });

                    // Kiểm tra và fetch danh sách buổi hẹn nếu là CUSTOMER
                    if (sessionData.body.user.role === 'CUSTOMER') {
                        await fetchPendingAppointments(cusId);
                    }
                } else {
                    console.warn("Invalid session data:", sessionData);
                    logout();
                }
            } catch (error) {
                console.error("Session check failed:", error.message);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Log để debug
        if (token) {
            checkSession();
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchPendingAppointments = async (cusId) => {
        console.log('Fetching pending appointments for cusId:', cusId); // Log để debug
        try {
            const appointments = await appointmentService.getPendingFeedbackAppointment();
            console.log('Raw appointments from API:', appointments); // Log dữ liệu API để kiểm tra

            // Đảm bảo appointments là mảng
            let appointmentsArray = Array.isArray(appointments) ? appointments : [];

            // Kiểm tra cusId và dữ liệu trước khi lọc
            console.log('Checking cusId for filtering:', { cusId, appointmentsArray });

            // Lọc các buổi hẹn thuộc về khách hàng hiện tại (chuẩn hóa cusId thành string)
            const customerAppointments = appointmentsArray.filter(
                appt => String(appt.cusId).trim() === String(cusId).trim() // So sánh "CUS003" với "CUS003"
            );
            console.log('Filtered appointments for cusId:', cusId, customerAppointments);
            setPendingAppointments(customerAppointments || []); // Đảm bảo luôn là mảng
        } catch (error) {
            console.error('Error fetching pending appointments:', error);
            setPendingAppointments([]); // Đặt về mảng rỗng nếu có lỗi
        }
    };

    const login = async (response) => {
        try {
            if (!response || !response.body) {
                throw new Error("Invalid login response");
            }

            const sessionData = response;
            console.log('Login response data:', sessionData);
            if (sessionData.body && sessionData.body.user && sessionData.body.token) {
                const loginData = sessionData.body;
                localStorage.setItem('user', JSON.stringify(loginData));
                localStorage.setItem('token', loginData.token);
                setUser({
                    ...loginData.user,
                    cusId: '', // Không gán cusId từ login, sẽ lấy từ session-info
                    address: '', // Khởi tạo rỗng, sẽ lấy từ session-info sau
                    dateOfBirth: '',
                    gender: ''
                });
                setSessionInfo(sessionData);

                // Sử dụng pendingFeedback từ response login nếu có
                if (sessionData.body.pendingFeedback) {
                    const pendingFeedbackArray = Array.isArray(sessionData.body.pendingFeedback) 
                        ? sessionData.body.pendingFeedback 
                        : [sessionData.body.pendingFeedback]; // Chuyển thành mảng nếu chỉ có 1 lịch hẹn
                    setPendingAppointments(pendingFeedbackArray);
                    console.log('Pending appointments set from login:', pendingFeedbackArray);
                }

                // Sau khi login thành công, gọi checkSession để lấy đầy đủ thông tin (bao gồm cusId, address, dateOfBirth, gender)
                await checkSessionAfterLogin(loginData.token);
            } else {
                throw new Error("Invalid login data received");
            }
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error;
        }
    };

    const checkSessionAfterLogin = async (token) => {
        try {
            localStorage.setItem('token', token); // Đảm bảo token được lưu
            const sessionData = await sessionService.checkSession();
            console.log('Session data after login:', sessionData); // Log để debug
            if (sessionData && sessionData.body && sessionData.body.cusId && sessionData.body.user) {
                setSessionInfo(sessionData);
                setUser({
                    ...sessionData.body.user,
                    cusId: sessionData.body.cusId, // Cập nhật cusId từ session (ví dụ: "CUS003")
                    address: sessionData.body.address || '',
                    dateOfBirth: sessionData.body.dateOfBirth || '',
                    gender: sessionData.body.gender || ''
                });

                // Fetch danh sách buổi hẹn nếu là CUSTOMER
                if (sessionData.body.user.role === 'CUSTOMER') {
                    await fetchPendingAppointments(sessionData.body.cusId);
                }
            }
        } catch (error) {
            console.error("Check session after login failed:", error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setSessionInfo(null);
        setPendingAppointments([]); // Xóa danh sách buổi hẹn khi đăng xuất
    };

    const value = {
        user,
        sessionInfo,
        pendingAppointments,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};