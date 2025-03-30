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
import vaccineService from '../service/vaccineService';



const PriceList = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const [vaccines, setVaccines] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔄 Starting data fetch...');
                setLoading(true);
    
                const [vaccinesData, packagesData] = await Promise.all([
                    vaccineService.getVaccines(),
                    vaccineService.getVaccinePackages()
                ]);
    
                console.log('💉 Vaccines data:', {
                    selectedType: 'single',
                    itemsCount: vaccinesData.length,
                    items: vaccinesData.map(vaccine => ({
                        id: vaccine.vaccineId,
                        name: vaccine.name,
                        price: vaccine.price,
                        shots: vaccine.shot,
                        manufacturer: vaccine.manufacturer,
                        description: vaccine.description
                    }))
                });
    
                console.log('📦 Packages data:', {
                    selectedType: 'package',
                    itemsCount: packagesData.length,
                    items: packagesData.map(pkg => ({
                        id: pkg.packageId,
                        name: pkg.name,
                        price: pkg.price,
                        description: pkg.description
                    }))
                });
    
                setVaccines(vaccinesData);
                setPackages(packagesData);
                setError(null);
    
                console.log('✅ Data fetch completed successfully');
            } catch (err) {
                console.error('❌ Error fetching data:', {
                    message: err.message,
                    error: err
                });
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
                console.log('🏁 Loading state finished');
            }
        };
    
        fetchData();
    }, []);

    const categories = [
        {
            id: 'all',
            name: 'Tất cả'
        },
        {
            id: 'vaccines',
            name: 'Vắc xin lẻ'
        },
        {
            id: 'packages',
            name: 'Gói vắc xin'
        }
    ];

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

    const handleVaccineSelect = (item, type) => {
        if (!user) {
            // Show login modal if user is not logged in
            showLoginRequiredModal();
        } else {
            // Navigate to registration page with the selected item
            navigate('/register-vaccination', { 
                state: { 
                    selectedItem: item,
                    selectedType: type // 'single' or 'package'
                } 
            });
        }
    };

    // Show login required modal
    const showLoginRequiredModal = () => {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'login-required-modal';
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">
                    <i class="fas fa-user-lock"></i>
                </div>
                <h3>Yêu cầu đăng nhập</h3>
                <p>Vui lòng đăng nhập để đăng ký tiêm chủng</p>
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
    };

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

    const renderContent = (category = selectedCategory) => {
        if (loading) {
            return <div className="loading">Đang tải dữ liệu...</div>;
        }
    
        if (error) {
            return <div className="error">{error}</div>;
        }
    
    // Update the renderVaccines function:
    const renderVaccines = () => (
        <div className="vaccines-grid">
            {vaccines
                .filter(vaccine =>
                    vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vaccine.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(vaccine => (
                    <div 
                        key={vaccine.vaccineId} 
                        className="vaccine-card clickable"
                        onClick={() => handleVaccineSelect(vaccine, 'single')}
                    >
                        <div className="vaccine-header">
                            <FaShieldAlt className="vaccine-icon" />
                            <h3>{vaccine.name}</h3>
                        </div>
                        <div className="vaccine-info">
                            <p><strong>Nhà sản xuất:</strong> {vaccine.manufacturer}</p>
                            <p><strong>Số mũi:</strong> {vaccine.shot}</p>
                        </div>
                        <div className="vaccine-details">
                            <p className="vaccine-description">
                                <strong>Mô tả:</strong> {vaccine.description}
                            </p>
                            <div className="vaccine-price">
                                <strong>Giá:</strong> {Number(vaccine.price).toLocaleString('vi-VN')}<span>đ</span>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
    
    // Similarly update the renderPackages function:
    const renderPackages = () => (
        <div className="vaccines-grid">
            {packages
                .filter(pkg =>
                    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(pkg => (
                    <div 
                        key={pkg.packageId} 
                        className="vaccine-card package-card clickable"
                        onClick={() => handleVaccineSelect(pkg, 'package')}
                    >
                        <div className="vaccine-header">
                            <FaSyringe className="vaccine-icon" />
                            <h3>{pkg.name}</h3>
                        </div>
                        <div className="vaccine-details">
                            <p className="vaccine-description">
                                <strong>Mô tả:</strong> {pkg.description}
                            </p>
                            <div className="vaccine-price">
                                <strong>Giá:</strong> {Number(pkg.price).toLocaleString('vi-VN')}<span>đ</span>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
    
        switch (category) {
            case 'vaccines':
                return renderVaccines();
            case 'packages':
                return renderPackages();
            default:
                return (
                    <>
                        <h2 className="category-title">Vắc xin lẻ</h2>
                        {renderVaccines()}
                        <h2 className="category-title">Gói vắc xin</h2>
                        {renderPackages()}
                    </>
                );
        }
    };


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
                
                <div className="category-filter">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {renderContent()}
            </div>
        </div>
    );
};


export default PriceList;



