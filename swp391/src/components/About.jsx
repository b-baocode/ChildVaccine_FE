import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/About.css';
import {
    FaCheckCircle,
    FaHospital,
    FaMedkit,
    FaUserMd,
    FaAward,
    FaCalendarAlt,
    FaUser,
    FaCalendar,
    FaChild,
    FaSignOutAlt,
    FaCaretDown
} from 'react-icons/fa';


const About = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);


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
        logout();
        setShowDropdown(false);
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
        <div className="about-page">
            {/* Header */}
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


            {/* Navigation */}
            <nav className="main-nav">
                <ul>
                    <li onClick={() => navigate('/')}>TRANG CHỦ</li>
                    <li onClick={() => navigate('/about')}>GIỚI THIỆU</li>
                    <li onClick={() => navigate('/handbook')}>CẨM NANG</li>
                    <li onClick={() => navigate('/price-list')}>BẢNG GIÁ</li>
                    <li onClick={() => navigate('/disease')}>BỆNH HỌC</li>
                    <li onClick={() => navigate('/news')}>TIN TỨC</li>
                    <li onClick={() => navigate('/child-profiles')}>HỒ SƠ TRẺ EM</li>
                    <li onClick={() => navigate('/child-profiles')}>PHẢN ỨNG SAU TIÊM</li>
                </ul>
            </nav>
           


            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
                    className="search-input"
                />
                <button className="search-button">
                    <i className="fa fa-search"></i>
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
                                <button className="dropdown-item">
                                    <FaUser className="item-icon" />
                                    Thông tin người dùng
                                </button>
                                <button className="dropdown-item">
                                    <FaCalendar className="item-icon" />
                                    Xem lịch tiêm
                                </button>
                                <button className="dropdown-item">
                                    <FaChild className="item-icon" />
                                    Thông tin hồ sơ trẻ em
                                </button>
                                <div className="dropdown-divider"></div>
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


            {/* About Content */}
            <div className="about-container">
                {/* Hero Section */}
                <div className="about-hero">
                    <div className="hero-content">
                        <h1>Về Chúng Tôi</h1>
                        <p>Hệ thống tiêm chủng VNVC - Đối tác đáng tin cậy cho sức khỏe gia đình bạn</p>
                    </div>
                </div>


                {/* Introduction Section */}
                <div className="about-section">
                    <h2>Giới Thiệu VNVC</h2>
                    <p>
                        VNVC là hệ thống trung tâm tiêm chủng lớn nhất Việt Nam với hơn 50 trung tâm trên toàn quốc.
                        Được thành lập từ năm 2017, VNVC đã và đang không ngừng phát triển, mang đến dịch vụ tiêm chủng
                        chất lượng cao cho hàng triệu người dân Việt Nam.
                    </p>
                    <div className="intro-images">
                        <div className="intro-image-item">
                            <img src="https://tanimed.vn/UserImages/2022/06/04/1/Picture1.jpg" alt="VNVC Facility" />
                            <div className="image-caption">Cơ sở vật chất hiện đại</div>
                        </div>
                        <div className="intro-image-item">
                            <img src="https://tphcm.cdnchinhphu.vn/334895287454388224/2024/9/22/tiem-vac-xin-17269411124131833569518.jpg" alt="VNVC Service" />
                            <div className="image-caption">Phòng tiêm chủng tiêu chuẩn</div>
                        </div>
                        <div className="intro-image-item">
                            <img src="https://quoctesannhihaiphong.vn/wp-content/uploads/2021/05/z2444219065881_55d6ad020d8f5ec471c51e82b7cb5435.jpg" alt="VNVC Staff" />
                            <div className="image-caption">Đội ngũ y bác sĩ chuyên nghiệp</div>
                        </div>
                    </div>
                </div>


                {/* Statistics Section */}
                <div className="stats-section">
                    <div className="stat-item">
                        <h3>50+</h3>
                        <p>Trung tâm toàn quốc</p>
                    </div>
                    <div className="stat-item">
                        <h3>2M+</h3>
                        <p>Khách hàng tin tưởng</p>
                    </div>
                    <div className="stat-item">
                        <h3>500+</h3>
                        <p>Nhân viên y tế</p>
                    </div>
                    <div className="stat-item">
                        <h3>30+</h3>
                        <p>Đối tác quốc tế</p>
                    </div>
                </div>


                {/* Features Section */}
                <div className="features-section">
                    <h2>Điểm Khác Biệt Của VNVC</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <FaHospital className="feature-icon" />
                            <h3>Cơ Sở Vật Chất Hiện Đại</h3>
                            <p>Hệ thống kho lạnh đạt tiêu chuẩn GSP, phòng tiêm riêng biệt, môi trường vô trùng.</p>
                        </div>
                        <div className="feature-item">
                            <FaMedkit className="feature-icon" />
                            <h3>Vắc Xin Chất Lượng</h3>
                            <p>Nhập khẩu trực tiếp từ các nhà sản xuất uy tín trên thế giới.</p>
                        </div>
                        <div className="feature-item">
                            <FaUserMd className="feature-icon" />
                            <h3>Đội Ngũ Chuyên Môn</h3>
                            <p>Bác sĩ và điều dưỡng có chuyên môn cao, nhiều năm kinh nghiệm.</p>
                        </div>
                        <div className="feature-item">
                            <FaAward className="feature-icon" />
                            <h3>Dịch Vụ Chuyên Nghiệp</h3>
                            <p>Tư vấn chi tiết, theo dõi sau tiêm, hỗ trợ 24/7.</p>
                        </div>
                    </div>
                </div>


                {/* Mission Section */}
                <div className="mission-section">
                    <div className="mission-content">
                        <h2>Sứ Mệnh & Tầm Nhìn</h2>
                        <div className="mission-items">
                            <div className="mission-item">
                                <FaCheckCircle className="check-icon" />
                                <p>Mang đến dịch vụ tiêm chủng chất lượng cao, an toàn cho mọi người dân</p>
                            </div>
                            <div className="mission-item">
                                <FaCheckCircle className="check-icon" />
                                <p>Trở thành hệ thống tiêm chủng hàng đầu Đông Nam Á</p>
                            </div>
                            <div className="mission-item">
                                <FaCheckCircle className="check-icon" />
                                <p>Nâng cao nhận thức cộng đồng về tầm quan trọng của tiêm chủng</p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Partners Section */}
                <div className="partners-section">
                    <h2>Đối Tác Của Chúng Tôi</h2>
                    <div className="partner-logos">
                        <img
                            src="https://thuonghieu.wiki/data/news/19863/GSK_logo_2022.jpg"
                            alt="GSK"
                            style={{"--i": 1}}
                        />
                        <img
                            src="https://thanhnien.mediacdn.vn/Uploaded/dieutrang-qc/2022_03_11/logo-moi-cua-sanofi-voi-hai-cham-tron-mau-tim-duoc-lay-cam-hung-tu-hanh-trinh-kham-pha-khoa-hoc-4803.png"
                            alt="Sanofi"
                            style={{"--i": 2}}
                        />
                        <img
                            src="https://www.pfizer.com.vn/images/PfizerLogoColorRGB-45928554117026-1463330.png"
                            alt="Pfizer"
                            style={{"--i": 3}}
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/MSD_Sharp_%26_Dohme_GmbH_logo.svg/2560px-MSD_Sharp_%26_Dohme_GmbH_logo.svg.png"
                            alt="MSD"
                            style={{"--i": 4}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default About;



