import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/PriceList.css';
import {
    FaCalendarAlt,
    FaUser,
    FaCalendar,
    FaChild,
    FaSignOutAlt,
    FaCaretDown,
    FaSearch,
    FaSyringe,
    FaShieldAlt
} from 'react-icons/fa';


const vaccineCategories = [
    {
        id: 1,
        name: "Vắc xin cho trẻ sơ sinh",
        vaccines: [
            {
                id: "V1",
                name: "Vắc xin 6 trong 1 (Infanrix Hexa)",
                manufacturer: "GSK",
                origin: "Bỉ",
                price: "829.000",
                description: "Phòng bệnh Bạch hầu, Ho gà, Uốn ván, Bại liệt, Viêm gan B, Hib"
            },
            {
                id: "V2",
                name: "Vắc xin 5 trong 1 (Pentaxim)",
                manufacturer: "Sanofi",
                origin: "Pháp",
                price: "759.000",
                description: "Phòng bệnh Bạch hầu, Ho gà, Uốn ván, Bại liệt, Hib"
            },
            {
                id: "V3",
                name: "Vắc xin Rotarix",
                manufacturer: "GSK",
                origin: "Bỉ",
                price: "899.000",
                description: "Phòng bệnh Tiêu chảy do Rota virus"
            }
        ]
    },
    {
        id: 2,
        name: "Vắc xin cho trẻ nhỏ",
        vaccines: [
            {
                id: "V4",
                name: "Vắc xin MMR",
                manufacturer: "MSD",
                origin: "Mỹ",
                price: "499.000",
                description: "Phòng bệnh Sởi, Quai bị, Rubella"
            },
            {
                id: "V5",
                name: "Vắc xin Varicella",
                manufacturer: "MSD",
                origin: "Mỹ",
                price: "849.000",
                description: "Phòng bệnh Thủy đậu"
            },
            {
                id: "V6",
                name: "Vắc xin Synflorix",
                manufacturer: "GSK",
                origin: "Bỉ",
                price: "989.000",
                description: "Phòng bệnh do phế cầu khuẩn"
            }
        ]
    },
    {
        id: 3,
        name: "Vắc xin phòng viêm gan",
        vaccines: [
            {
                id: "V7",
                name: "Vắc xin Euvax B",
                manufacturer: "LG",
                origin: "Hàn Quốc",
                price: "159.000",
                description: "Phòng bệnh Viêm gan B"
            },
            {
                id: "V8",
                name: "Vắc xin Havax",
                manufacturer: "Berna Biotech",
                origin: "Hàn Quốc",
                price: "469.000",
                description: "Phòng bệnh Viêm gan A"
            }
        ]
    }
];


const PriceList = () => {
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


    const filteredCategories = vaccineCategories.filter(category =>
        selectedCategory === 'all' || category.id === parseInt(selectedCategory)
    );


    return (
        <div className="price-list-page">
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
                    <li onClick={() => navigate('/price-list')} className="active">BẢNG GIÁ</li>
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


            {/* Price List Content */}
            <div className="price-list-container">
                <h1 className="price-list-title">Bảng Giá Vắc Xin</h1>
               
                {/* Category Filter */}
                <div className="category-filter">
                    <button
                        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        Tất cả
                    </button>
                    {vaccineCategories.map(category => (
                        <button
                            key={category.id}
                            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>


                {/* Vaccine List */}
                <div className="vaccine-categories">
                    {filteredCategories.map(category => (
                        <div key={category.id} className="category-section">
                            <h2 className="category-title">
                                <FaSyringe className="category-icon" />
                                {category.name}
                            </h2>
                            <div className="vaccines-grid">
                                {category.vaccines
                                    .filter(vaccine =>
                                        vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        vaccine.description.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map(vaccine => (
                                        <div key={vaccine.id} className="vaccine-card">
                                            <div className="vaccine-header">
                                                <FaShieldAlt className="vaccine-icon" />
                                                <h3>{vaccine.name}</h3>
                                            </div>
                                            <div className="vaccine-info">
                                                <p><strong>Nhà sản xuất:</strong> {vaccine.manufacturer}</p>
                                                <p><strong>Xuất xứ:</strong> {vaccine.origin}</p>
                                                <p className="vaccine-description">{vaccine.description}</p>
                                                <div className="vaccine-price">
                                                    {vaccine.price}<span>đ</span>
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


export default PriceList;



