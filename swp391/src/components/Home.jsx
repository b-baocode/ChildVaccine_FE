import React, { useState, useEffect, useRef, Navigate } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import authService from '../service/AuthenService';
import sessionService from '../service/sessionService';

import {
    FaCalendarAlt,
    FaBook,
    FaSyringe,
    FaDollarSign,
    FaClipboardList,
    FaMapMarkedAlt,
    FaUser,
    FaCalendar,
    FaChild,
    FaSignOutAlt,
    FaCaretDown,
    FaMobileAlt,
    FaPhone,
    FaShoppingCart,
    FaSearch
} from 'react-icons/fa';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import appointmentService from '../service/appointmentService';


const Home = () => {
    const { user, logout, login } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const dropdownRef = useRef(null);
    const [upcomingAppointment, setUpcomingAppointment] = useState(null);
    const [isSessionValid, setIsSessionValid] = useState(true);

    const TopBanner = () => (
        <div className="top-banner">
            <div className="banner-content">
                <span>Trung tâm tiêm chủng</span>
                <a href="#" className="banner-link">Xem chi tiết</a>
            </div>
            <div className="banner-actions">
                <a href="https://play.google.com/store/apps/details?id=com.eco.eplus&hl=vi" 
                    className="banner-action"
                    target="_blank" 
                    rel="noopener noreferrer">
                        <FaMobileAlt /> Tải ứng dụng
                </a>
                <a href="tel:18006928" className="banner-action">
                    <FaPhone /> Tư vấn ngay: 1800 6928
                </a>
            </div>
        </div>
    );

    useEffect(() => {
        //console.log('Pending Appointments updated in Home:', pendingAppointments); // Log để debug
        setShowNotification(pendingAppointments.length > 0);
    }, [pendingAppointments])


    useEffect(() => {
        // If no user, nothing to do with role-based routing
        if (!user) return;
        
        console.log('🔑 Role-based redirection check:', user.role);
        
        const validateSession = async () => {
            try {
                // Verify the session is valid
                const sessionData = await sessionService.checkSession();
                
                // If session check passed, handle role-based routing
                if (user.role === 'STAFF') {
                    console.log('👨‍⚕️ Staff user detected, redirecting to staff page');
                    navigate('/staff');
                    return;
                }
                
                if (user.role === 'ADMIN') {
                    console.log('👨‍💼 Admin user detected, redirecting to admin page');
                    navigate('/admin');
                    return;
                }
                
                console.log('👤 Customer user, staying on home page');
                
            } catch (error) {
                console.error('❌ Session validation failed:', error);
                setIsSessionValid(false);
                logout(); // Logout if session check fails
            }
        };
        
        validateSession();
    }, [user, navigate, logout]);

    useEffect(() => {
        const fetchUpcomingAppointments = async () => {
            if (!user || user.role !== 'CUSTOMER' || !isSessionValid) {
                setUpcomingAppointment(null);
                return;
            }

            try {
                const sessionData = await sessionService.checkSession();
                if (!sessionData || !sessionData.body) {
                    console.log("Session expired, logging out");
                    logout();
                    return;
                }

                // Get all appointments for this customer
                let appointments = [];
                try {
                    const response = await appointmentService.getAppointmentsByCustomerId(sessionData.body.cusId);
                    appointments = Array.isArray(response) ? response : [];
                    console.log('Fetched appointments:', appointments.length > 0 
                        ? `${appointments.length} appointments found` 
                        : 'Không tìm thấy lịch hẹn nào cho khách hàng này');
                } catch (err) {
                    console.error('Error fetching appointments:', err);
                    appointments = [];
                }

                if (appointments && appointments.length > 0) {
                    // Get current date and time
                    const now = new Date();
                    const today = new Date(now);
                    today.setHours(0, 0, 0, 0);
                    
                    // Get date 2 days from now (instead of 3)
                    const twoDaysLater = new Date(today);
                    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
                    
                    // Filter appointments:
                    // 1. Only appointments that have not been completed
                    // 2. Only within next 2 days
                    const filteredAppointments = appointments.filter(app => {
                        const appDate = new Date(app.appointmentDate);
                        appDate.setHours(0, 0, 0, 0);
                        
                        return app.status !== 'COMPLETED' && 
                               app.stauts !== 'CANCELLED' &&
                               appDate >= today && 
                               appDate <= twoDaysLater;
                    });
                    
                    // Sort by date and then by time slot to get the closest appointment
                    filteredAppointments.sort((a, b) => {
                        // First sort by date
                        const dateA = new Date(a.appointmentDate);
                        const dateB = new Date(b.appointmentDate);
                        
                        if (dateA.getTime() !== dateB.getTime()) {
                            return dateA - dateB;
                        }
                        
                        // If dates are equal, sort by time slot
                        // Convert time slots to minutes for easier comparison
                        const getMinutes = (timeSlot) => {
                            const hour = parseInt(timeSlot.substring(0, 2));
                            const minute = parseInt(timeSlot.substring(2, 4));
                            return hour * 60 + minute;
                        };
                        
                        return getMinutes(a.timeSlot) - getMinutes(b.timeSlot);
                    });
                    
                    // Get the closest upcoming appointment
                    if (filteredAppointments.length > 0) {
                        setUpcomingAppointment(filteredAppointments[0]);
                    } else {
                        setUpcomingAppointment(null);
                    }
                } else {
                    setUpcomingAppointment(null);
                }
            } catch (error) {
                console.error('Error fetching upcoming appointments:', error);
            
                if (error.message && error.message.includes('authentication')) {
                    logout();
                }
            }
        };
        
        fetchUpcomingAppointments();
    }, [user, isSessionValid, logout]);

    useEffect(() => {
        if (!user) {
            setUpcomingAppointment(null);
            setPendingAppointments([]);
        }
    }, [user]);

    const checkSession = async () => {
        const token = authService.getToken();
        const storedUser = authService.getUser();
    
        console.log("🔵 Home.jsx - Token from localStorage:", token);
        console.log("🟠 Home.jsx - Stored user:", storedUser);
    
        if (token && !user) {
            console.log("🔵 Restoring session...");
            try {
                const sessionData = await sessionService.checkSession();
                console.log("🔍 Session response:", sessionData);
    
                if (sessionData && sessionData.body?.user) {
                    login(sessionData);
                } else {
                    console.warn("🔴 Session invalid, logging out...");
                    logout();
                }
            } catch (error) {
                console.error("🔴 Error checking session:", error);
                logout();
            }
        }
    };
    

    console.log('User in Home:', user); // Log để debug user.cusId
    // console.log('Pending Appointments in Home:', pendingAppointments); // Log để debug

    const handleFeedbackClick = () => {
        if (pendingAppointments.length > 0) {
            const latestAppointment = [...pendingAppointments].sort(
                (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
            )[0];
            navigate('/feedback', { state: { appointment: latestAppointment } });
            setShowNotification(false); // Ẩn thông báo sau khi chuyển đến trang Feedback
        }
    };

    const handleNotificationCancel = () => {
        setShowNotification(false);
    };


    const handleLoginClick = () => {
        navigate('/login');
    };


    const handleLogoutClick = async () => {
        try {
            setShowLogoutDialog(true);
            setShowDropdown(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };


    const handleLogoutConfirm = async () => {
        try {
            await logout();
            setShowLogoutDialog(false);
            // Optional: Show logout success message
            const modal = document.createElement('div');
            modal.className = 'success-modal';
            modal.innerHTML = `
                <div class="success-content">
                    <h3>Đăng xuất thành công</h3>
                    <p>Hẹn gặp lại!</p>
                </div>
            `;
            document.body.appendChild(modal);
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 1500);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };


    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };


    const handleVaccineRegister = () => {
        if (!user) {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'login-required-modal';
            modalOverlay.innerHTML = `
                <div class="modal-content">
                    <div class="modal-icon">
                        <i class="fas fa-user-lock"></i>
                    </div>
                    <h3>Yêu cầu đăng nhập</h3>
                    <p>Vui lòng đăng nhập để sử dụng dịch vụ đăng ký tiêm chủng</p>
                    <div class="modal-buttons">
                        <button class="login-btn">Đăng nhập ngay</button>
                        <button class="cancel-btn">Đóng</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modalOverlay);

            const loginBtn = modalOverlay.querySelector('.login-btn');
            const cancelBtn = modalOverlay.querySelector('.cancel-btn');
            
            loginBtn.addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
                navigate('/login', { state: { from: '/register-vaccination' } });
            });

            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
            });
        } else {
            navigate('/register-vaccination');
        }
    };


    return (
        <div className="home">
            {/* Notification */}
            {showNotification && pendingAppointments.length > 0 && (
                <div className="feedback-notification">
                    <p>Bạn có {pendingAppointments.length} buổi hẹn chưa đánh giá</p>
                    <div className="notification-buttons">
                        <button onClick={handleNotificationCancel} className="cancel-btn">
                            Hủy
                        </button>
                        <button onClick={handleFeedbackClick} className="feedback-btn">
                            Đánh giá
                        </button>
                    </div>
                </div>
            )}

            <TopBanner />       

            <div className="header">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src="https://vnvc.vn/img/logo-tet-vnvc.png" alt="VNVC Logo" />
                </div>
                <div className="header-actions">
                <div className="hotline">
                        Hotline: 028 7102 6595
                        <div className="sub-text">Mở cửa 7h30 - 17h00 / T2 - CN xuyên trưa*</div>
                    </div>
                    {/* Add auth buttons in header */}
                </div>
            </div>

            <nav className="main-nav">
                <ul>
                    <li onClick={() => navigate('/')}>TRANG CHỦ</li>
                    <li onClick={() => navigate('/about')}>GIỚI THIỆU</li>
                    <li onClick={() => navigate('/handbook')}>CẨM NANG</li>
                    <li onClick={() => navigate('/price-list')}>BẢNG GIÁ</li>
                    <li onClick={() => navigate('/disease')}>BỆNH HỌC</li>
                    <li onClick={() => navigate('/news')}>TIN TỨC</li>
                    {/* Only show these items if user is logged in and is a CUSTOMER */}
                    {user && user.role === 'CUSTOMER' && (
                        <>
                            <li onClick={() => navigate('/child-profiles')}>HỒ SƠ TRẺ EM</li>
                            <li onClick={() => navigate('/react-report')}>PHẢN ỨNG SAU TIÊM</li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="search-container">
                <div className="upcoming-vaccinations">
                    {/* Only show appointment info if user exists */}
                    {user ? (
                        <>
                            <div className="notification-icon">
                                <FaCalendar />
                            </div>
                            <div className="notification-content">
                                <span className="notification-title">Thông báo lịch tiêm</span>
                                {upcomingAppointment ? (
                                    <span className="notification-text">
                                        Bạn có buổi hẹn sắp tới vào {new Date(upcomingAppointment.appointmentDate).toLocaleDateString('vi-VN')} vào lúc {upcomingAppointment.appointmentTime}
                                    </span>
                                ) : (
                                    <span className="notification-text">Không có lịch tiêm sắp tới</span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="notification-content">
                        </div>
                    )}
                </div>
                
                {user ? (
                    <div className="user-dropdown" ref={dropdownRef}>
                        <button
                            className="user-menu-button"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <FaUser className="user-icon" />
                            <span>{user.fullName}</span>
                            <FaCaretDown className={`dropdown-icon ${showDropdown ? 'rotate' : ''}`} />
                        </button>
                        
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <FaUser className="header-icon" />
                                    <div className="user-info">
                                        <span className="user-name">{user.fullName}</span>
                                        <span className="user-email">{user.email}</span>
                                        <span className="user-role">
                                            {user.role === 'ADMIN' ? 'Quản trị viên' :
                                             user.role === 'STAFF' ? 'Nhân viên' : 'Khách hàng'}
                                        </span>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                {/* Role-specific menu items */}
                                {user.role === 'ADMIN' && (
                                    <button className="dropdown-item" onClick={() => navigate('/admin')}>
                                        <FaUser className="item-icon" />
                                        Quản lý hệ thống
                                    </button>
                                )}
                                {user.role === 'STAFF' && (
                                    <button className="dropdown-item" onClick={() => navigate('/staff')}>
                                        <FaUser className="item-icon" />
                                        Trang nhân viên
                                    </button>
                                )}
                                {/* Common menu items */}
                                <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                    <FaUser className="item-icon" />
                                    Thông tin người dùng
                                </button>
                                <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                                    <FaSignOutAlt className="item-icon" />
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="login-button" onClick={handleLoginClick}>
                        Đăng nhập
                    </button>
                )}
            </div>

            <div className="vaccine-section">
                <div className="vaccine-banner-wrapper">
                    <h1>TRUNG TÂM TIÊM CHỦNG VẮC XIN</h1>
                    <button className="register-btn" onClick={handleVaccineRegister}>
                        <FaCalendarAlt />
                        Đăng ký tiêm
                    </button>
                </div>
            </div>

            <div className="slider-section">
                <Carousel
                    autoPlay
                    infiniteLoop
                    showStatus={false}
                    showThumbs={false}
                    interval={5000}
                    className="main-carousel"
                >
                    <div>
                        <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/1440_X490_fc8b6c0e72.jpg" alt="Slide 1" />
                    </div>
                    <div>
                        <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_web_SXH_T11_1440x490_eb49d92a40.jpg" alt="Slide 2" />
                    </div>
                    <div>
                        <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/1440x490_4d5a2e57da.png" alt="Slide 3" />
                    </div>
                    <div>
                        <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/BANNERWEB_6_IN_1_FR_1_1440x490_137ec11ded.png" alt="Slide 4" />
                    </div>
                </Carousel>
            </div>

            {showLogoutDialog && (
                <LogoutConfirmDialog
                    onConfirm={handleLogoutConfirm}
                    onCancel={handleLogoutCancel}
                />
            )}
        </div>
    );
};





export default Home;