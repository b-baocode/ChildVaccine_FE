import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/News.css';
import {
    FaCalendarAlt,
    FaUser,
    FaCalendar,
    FaChild,
    FaSignOutAlt,
    FaCaretDown,
    FaSearch,
    FaClock,
    FaEye,
    FaNewspaper,
    FaTags
} from 'react-icons/fa';


const newsData = [
    {
        id: 1,
        category: "Tin hoạt động",
        articles: [
            {
                id: "N1",
                title: "VNVC khai trương trung tâm tiêm chủng thứ 50 tại Hà Nội",
                summary: "Ngày 15/3/2024, VNVC chính thức khai trương trung tâm tiêm chủng thứ 50 tại quận Cầu Giấy, Hà Nội...",
                image: "https://vnvc.vn/wp-content/uploads/2024/08/vnvc-khai-truong-trung-tam-tiem-chung-vip-1.jpg",
                date: "15/03/2024",
                views: 1250,
                readTime: "5 phút đọc",
                author: "Admin VNVC"
            },
        ]
    },
    {
        id: 2,
        category: "Tin tức y tế",
        articles: [
            {
                id: "N3",
                title: "WHO cảnh báo về đợt bùng phát bệnh sởi tại Châu Âu",
                summary: "Tổ chức Y tế Thế giới (WHO) vừa đưa ra cảnh báo về sự gia tăng các ca mắc bệnh sởi tại nhiều nước Châu Âu...",
                image: "https://cdn.tuoitre.vn/thumb_w/480/2018/11/30/104544940gettyimages-1066472858-1543565347822716684685.jpg",
                date: "12/03/2024",
                views: 1500,
                readTime: "7 phút đọc",
                author: "BS. Nguyễn Văn A"
            },
            {
                id: "N4",
                title: "Phát hiện biến chủng mới của virus cúm A/H3N2",
                summary: "Các nhà khoa học vừa phát hiện một biến chủng mới của virus cúm A/H3N2 có khả năng lây lan nhanh...",
                image: "https://vnvc.vn/wp-content/uploads/2022/06/cum-a-h3n2.jpg",
                date: "10/03/2024",
                views: 2100,
                readTime: "6 phút đọc",
                author: "BS. Trần Thị B"
            }
        ]
    },
    {
        id: 3,
        category: "Tư vấn tiêm chủng",
        articles: [
            {
                id: "N5",
                title: "Những điều cần biết khi tiêm chủng cho trẻ trong mùa nóng",
                summary: "Tiêm chủng trong mùa nóng cần lưu ý những gì? Làm thế nào để đảm bảo an toàn cho trẻ?...",
                image: "https://8486d3381d.vws.vegacdn.vn/uploadfoldernew/sgdlongbien/image/mnviethung/2021_9_image/15_10092021(1).jpg",
                date: "08/03/2024",
                views: 1800,
                readTime: "8 phút đọc",
                author: "BS. Lê Thị C"
            },
            {
                id: "N6",
                title: "Lịch tiêm chủng cho trẻ từ 0-12 tháng tuổi năm 2024",
                summary: "Cập nhật lịch tiêm chủng mới nhất cho trẻ từ 0-12 tháng tuổi theo khuyến cáo của Bộ Y tế...",
                image: "https://vnvc.vn/wp-content/uploads/2021/10/bang-lich-tiem.png",
                date: "05/03/2024",
                views: 2500,
                readTime: "10 phút đọc",
                author: "BS. Phạm Văn D"
            }
        ]
    }
];


const News = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
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


    const filteredCategories = newsData.filter(category =>
        selectedCategory === 'all' || category.id === parseInt(selectedCategory)
    );


    return (
        <div className="news-page">
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
                    <li onClick={() => navigate('/news')} className="active">TIN TỨC</li>
                    <li onClick={() => navigate('/child-profiles')}>HỒ SƠ TRẺ EM</li>
                    <li onClick={() => navigate('/child-profiles')}>PHẢN ỨNG SAU TIÊM</li>
                </ul>
            </nav>


            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm tin tức..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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


            {/* News Content */}
            <div className="news-container">
                <h1 className="news-title">Tin Tức & Sự Kiện</h1>
               
                {/* Category Filter */}
                <div className="category-filter">
                    <button
                        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        Tất cả
                    </button>
                    {newsData.map(category => (
                        <button
                            key={category.id}
                            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.category}
                        </button>
                    ))}
                </div>


                {/* News List */}
                <div className="news-categories">
                    {filteredCategories.map(category => (
                        <div key={category.id} className="category-section">
                            <h2 className="category-title">
                                <FaNewspaper className="category-icon" />
                                {category.category}
                            </h2>
                            <div className="news-grid">
                                {category.articles
                                    .filter(article =>
                                        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map(article => (
                                        <div key={article.id} className="news-card">
                                            <div className="news-image">
                                                <img src={article.image} alt={article.title} />
                                                <div className="category-tag">
                                                    <FaTags className="tag-icon" />
                                                    {category.category}
                                                </div>
                                            </div>
                                            <div className="news-content">
                                                <h3>{article.title}</h3>
                                                <p>{article.summary}</p>
                                                <div className="news-meta">
                                                    <span><FaUser /> {article.author}</span>
                                                    <span><FaClock /> {article.readTime}</span>
                                                    <span><FaEye /> {article.views} lượt xem</span>
                                                    <span><FaCalendar /> {article.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default News;



