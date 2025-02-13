import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmDialog from './LogoutConfirmDialog';


const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };


        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleLoginClick = () => {
        navigate('/login');
    };


    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
        setShowDropdown(false);
    };


    const handleLogoutConfirm = () => {
        logout();
        setShowLogoutDialog(false);
    };


    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };


    const handleVaccineRegister = () => {
        if (!user) {
            const modal = document.createElement('div');
            modal.className = 'login-required-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Yêu cầu đăng nhập</h3>
                    <p>Vui lòng đăng nhập để đăng ký tiêm chủng</p>
                    <button class="login-btn">Đăng nhập</button>
                </div>
            `;
           
            document.body.appendChild(modal);


            const loginBtn = modal.querySelector('.login-btn');
            loginBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                navigate('/login');
            });


            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        } else {
            navigate('/register-vaccination');
        }
    };


    return (
        <div className="home">
            <div className="header">
                <div className="logo">
                    <img src="https://vnvc.vn/img/logo-tet-vnvc.png" alt="VNVC Logo" />
                </div>
                <div className="header-actions">
                    <div className="hotline">
                        Hotline: 028 7102 6595
                        <div className="sub-text">Mở cửa 7h30 - 17h00 / T2 - CN xuyên trưa*</div>
                    </div>
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
                    <li onClick={() => navigate('/child-profiles')}>HỒ SƠ TRẺ EM</li>
                    <li onClick={() => navigate('/react-report')}>PHẢN ỨNG SAU TIÊM</li>
                </ul>
            </nav>


            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
                    className="search-input"
                />
                <button className="search-button">
                    <FaSearch />
                </button>
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
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/profile')}
                                >
                                    <FaUser className="item-icon" />
                                    Thông tin người dùng
                                </button>
                                <button
                                    className="dropdown-item logout-item"
                                    onClick={handleLogoutClick}
                                >
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


const TopBanner = () => (
    <div className="top-banner">
        <div className="banner-content">
            <span>Trung tâm tiêm chủng Long Châu</span>
            <a href="#" className="banner-link">Xem chi tiết</a>
        </div>
        <div className="banner-actions">
            <a href="#" className="banner-action">
                <FaMobileAlt /> Tải ứng dụng
            </a>
            <a href="tel:18006928" className="banner-action">
                <FaPhone /> Tư vấn ngay: 1800 6928
            </a>
        </div>
    </div>
);


export default Home;



