import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Disease.css';
import {
    FaCalendarAlt,
    FaUser,
    FaCalendar,
    FaChild,
    FaSignOutAlt,
    FaCaretDown,
    FaSearch,
    FaVirus,
    FaInfoCircle
} from 'react-icons/fa';


const diseases = [
    {
        id: 1,
        category: "Bệnh truyền nhiễm phổ biến",
        diseases: [
            {
                id: "D1",
                name: "Bệnh Sởi",
                symptoms: "Sốt cao, phát ban, ho, chảy nước mũi",
                prevention: "Tiêm vaccine MMR",
                risk: "Cao",
                complications: "Viêm phổi, viêm não, mù lòa",
                image: "https://tanbinhthanhpho.tayninh.gov.vn/uploads/news/2024_09/benh-soi-2.9.jpg"
            },
            {
                id: "D2",
                name: "Bệnh Quai bị",
                symptoms: "Sưng tuyến mang tai, sốt, đau đầu",
                prevention: "Tiêm vaccine MMR",
                risk: "Trung bình",
                complications: "Viêm tinh hoàn, viêm màng não",
                image: "https://www.vinmec.com/static/uploads/20190417_154204_311503_benh_quai_bi_va_nhu_max_1800x1800_jpg_7479e55104.jpg"
            },
            {
                id: "D3",
                name: "Bệnh Thủy đậu",
                symptoms: "Phát ban ngứa, mụn nước, sốt nhẹ",
                prevention: "Tiêm vaccine Varicella",
                risk: "Trung bình",
                complications: "Nhiễm trùng da, viêm phổi",
                image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/4/4/bi-thuy-dau-mun-mu-co-nguy-hiem-khong-va-cach-xu-ly-mutfp-1523465950large-1649072439309682110302.jpg"
            }
        ]
    },
    {
        id: 2,
        category: "Bệnh đường hô hấp",
        diseases: [
            {
                id: "D6",
                name: "Bệnh Ho gà",
                symptoms: "Ho dữ dội kéo dài, khó thở",
                prevention: "Tiêm vaccine DPT",
                risk: "Cao ở trẻ nhỏ",
                complications: "Viêm phổi, co giật",
                image: "https://bcp.cdnchinhphu.vn/334894974524682240/2024/7/29/221004-2-1-080155-041022-61-1722245228535834366297.jpg"
            },
            {
                id: "D7",
                name: "Bệnh Bạch hầu",
                symptoms: "Đau họng, sốt, khó thở",
                prevention: "Tiêm vaccine DPT",
                risk: "Cao",
                complications: "Tổn thương tim, liệt",
                image: "https://xdcs.cdnchinhphu.vn/446259493575335936/2024/7/9/benh-bach-hau-1701418979657223572422-1720481652036-1720481652298665844434.jpg"
            }
        ]
    }
];


const Disease = () => {
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


    const filteredCategories = diseases.filter(category =>
        selectedCategory === 'all' || category.id === parseInt(selectedCategory)
    );


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
                navigate('/login');
            });

            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(modalOverlay);
            });

            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    document.body.removeChild(modalOverlay);
                }
            });
        } else {
            navigate('/register-vaccination');
        }
    };


    return (
        <div className="disease-page">
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
                    <li onClick={() => navigate('/disease')} className="active">BỆNH HỌC</li>
                    <li onClick={() => navigate('/news')}>TIN TỨC</li>
                    <li onClick={() => navigate('/child-profiles')}>HỒ SƠ TRẺ EM</li>
                    <li onClick={() => navigate('/child-profiles')}>PHẢN ỨNG SAU TIÊM</li>
                </ul>
            </nav>




            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm thông tin bệnh..."
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


            {/* Disease Content */}
            <div className="disease-container">
                <h1 className="disease-title">Thông Tin Bệnh Học</h1>
               
                {/* Category Filter */}
                <div className="category-filter">
                    <button
                        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        Tất cả
                    </button>
                    {diseases.map(category => (
                        <button
                            key={category.id}
                            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.category}
                        </button>
                    ))}
                </div>


                {/* Disease List */}
                <div className="disease-categories">
                    {filteredCategories.map(category => (
                        <div key={category.id} className="category-section">
                            <h2 className="category-title">
                                <FaVirus className="category-icon" />
                                {category.category}
                            </h2>
                            <div className="diseases-grid">
                                {category.diseases
                                    .filter(disease =>
                                        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        disease.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map(disease => (
                                        <div key={disease.id} className="disease-card">
                                            <div className="disease-image">
                                                <img src={disease.image} alt={disease.name} />
                                            </div>
                                            <div className="disease-header">
                                                <FaInfoCircle className="disease-icon" />
                                                <h3>{disease.name}</h3>
                                            </div>
                                            <div className="disease-info">
                                                <p><strong>Triệu chứng:</strong> {disease.symptoms}</p>
                                                <p><strong>Phòng ngừa:</strong> {disease.prevention}</p>
                                                <p><strong>Mức độ nguy hiểm:</strong> {disease.risk}</p>
                                                <p><strong>Biến chứng:</strong> {disease.complications}</p>
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


export default Disease;



