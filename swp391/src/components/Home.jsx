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
            navigate('/register-vaccine');
        }
    };

    return (
        <div className="home">
            <TopBanner />
            
            <div className="header">
                <div className="logo">
                    <img src="https://quyhyvong.com/wp-content/uploads/2021/12/Logo-Long-Chau.png" alt="Long Châu Logo" />
                </div>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
                    />
                    <button className="search-btn">
                        <FaSearch />
                    </button>
                </div>

                <div className="header-actions">
                    <button className="login-btn">
                        <FaUser />
                        Đăng nhập
                    </button>
                </div>
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