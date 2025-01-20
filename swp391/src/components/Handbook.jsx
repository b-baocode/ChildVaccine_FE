import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Handbook.css';
import { 
    FaCalendarAlt,
    FaUser,
    FaCalendar,
    FaChild,
    FaSignOutAlt,
    FaCaretDown,
    FaSearch,
    FaClock,
    FaEye
} from 'react-icons/fa';

const articles = [
    {
        id: 1,
        category: "Tiêm chủng trẻ em",
        title: "Lịch tiêm chủng đầy đủ cho trẻ từ 0-24 tháng tuổi",
        image: "https://www.huggies.com.vn/-/media/Project/HuggiesVN/Images/Articles/Cham-soc-be/cac-mui-tiem-phong-cho-be-theo-thang-3.jpg?h=529&w=800&hash=D927B3AD61D777ECA9212029C322E0CA&hash=D927B3AD61D777ECA9212029C322E0CA",
        description: "Hướng dẫn chi tiết về lịch tiêm chủng cơ bản và vaccine khuyến nghị cho trẻ...",
        readTime: "8 phút đọc",
        views: 1520,
        date: "15/03/2024"
    },
    {
        id: 2,
        category: "Vaccine",
        title: "Tất tần tật về vaccine 6 trong 1, cha mẹ cần biết",
        image: "https://tamanhhospital.vn/wp-content/uploads/2024/11/vacxin-6-trong-1.jpg",
        description: "Vaccine 6 trong 1 là gì? Những điều cần biết về vaccine phối hợp phòng nhiều bệnh...",
        readTime: "6 phút đọc",
        views: 980,
        date: "12/03/2024"
    },
    {
        id: 3,
        category: "Sức khỏe",
        title: "Chăm sóc trẻ sau khi tiêm phòng",
        image: "https://vnvc.vn/wp-content/uploads/2024/05/cach-cham-soc-tre-sau-tiem-chung.jpg",
        description: "Hướng dẫn chi tiết cách chăm sóc trẻ sau tiêm vaccine, xử lý các phản ứng phụ...",
        readTime: "5 phút đọc",
        views: 2100,
        date: "10/03/2024"
    },
    {
        id: 4,
        category: "Bệnh truyền nhiễm",
        title: "Phòng ngừa bệnh sởi ở trẻ em hiệu quả",
        image: "https://hcdc.vn/public/img/02bf8460bf0d6384849ca010eda38cf8e9dbc4c7/images/mod1/images/bich-chuong-ve-phong-ngua-benh-soi/images/8BFCAF15-7E3D-4834-8EE9-32EC68BC8575.jpeg",
        description: "Tất cả thông tin về bệnh sởi, cách phòng ngừa và điều trị hiệu quả...",
        readTime: "7 phút đọc",
        views: 1250,
        date: "08/03/2024"
    },
];

const Handbook = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
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

    const categories = ['Tất cả', 'Tiêm chủng trẻ em', 'Vaccine', 'Sức khỏe', 'Bệnh truyền nhiễm'];

    const filteredArticles = selectedCategory === 'Tất cả' 
        ? articles 
        : articles.filter(article => article.category === selectedCategory);

    return (
        <div className="handbook-page">
            {/* Header */}
            <div className="header">
                <div className="logo">
                    <img src="https://i.gyazo.com/f738ee4c4bf9e15d9fa2239bbb11fcc6.png" alt="VNVC Logo" />
                </div>
                <div className="header-actions">
                    <div className="action-item" onClick={handleVaccineRegister}>
                        <FaCalendarAlt />
                        <span>ĐĂNG KÝ TIÊM</span>
                    </div>
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
                    <li onClick={() => navigate('/handbook')} className="active">CẨM NANG</li>
                    <li onClick={() => navigate('/price-list')}>BẢNG GIÁ</li>
                    <li onClick={() => navigate('/disease')}>BỆNH HỌC</li>
                    <li onClick={() => navigate('/news')}>TIN TỨC</li>
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

            {/* Handbook Content */}
            <div className="handbook-container">
                <h1 className="handbook-title">Cẩm Nang Tiêm Chủng</h1>
                
                {/* Categories */}
                <div className="categories">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                <div className="articles-grid">
                    {filteredArticles.map(article => (
                        <div key={article.id} className="article-card">
                            <div className="article-image">
                                <img src={article.image} alt={article.title} />
                                <span className="category-tag">{article.category}</span>
                            </div>
                            <div className="article-content">
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <div className="article-meta">
                                    <span><FaClock /> {article.readTime}</span>
                                    <span><FaEye /> {article.views} lượt xem</span>
                                    <span>{article.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Handbook; 