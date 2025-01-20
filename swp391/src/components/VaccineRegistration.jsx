import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/VaccineRegistration.css';
import { 
    FaCalendarAlt,
    FaUser,
    FaMapMarkerAlt,
    FaArrowLeft,
    FaSearch
} from 'react-icons/fa';

const VaccineRegistration = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        gender: '',
        phone: '',
        email: '',
        registrationType: 'self', // 'self' or 'other'
        province: '',
        district: ''
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [centers, setCenters] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState('');
    const [showVaccineModal, setShowVaccineModal] = useState(false);
    const [selectedVaccines, setSelectedVaccines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const vaccinationInfoRef = useRef(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
                const result = await response.json();
                if (result.error === 0) {
                    setProvinces(result.data);
                }
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (formData.province) {
                try {
                    const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${formData.province}.htm`);
                    const result = await response.json();
                    if (result.error === 0) {
                        setDistricts(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            } else {
                setDistricts([]);
            }
        };

        fetchDistricts();
    }, [formData.province]);

    useEffect(() => {
        if (formData.district) {
            // Fake data trung tâm dựa trên district
            const fakeCenters = [
                {
                    id: '1',
                    name: `Tiêm Chủng FPT Long Châu: ${formData.district}`,
                    address: `123 Đường ABC, Quận ${formData.district}`,
                    status: 'Đang đóng',
                    openTime: '07:30'
                },
                {
                    id: '2',
                    name: `Tiêm Chủng FPT Long Châu: ${formData.district} - CS2`,
                    address: `456 Đường XYZ, Quận ${formData.district}`,
                    status: 'Đang đóng',
                    openTime: '07:30'
                }
            ];
            setCenters(fakeCenters);
        } else {
            setCenters([]);
        }
    }, [formData.district]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    // Thêm data cho các gói vaccine
    const vaccinePackages = [
        {
            id: 1,
            title: "GÓI DÀNH CHO TRẺ SƠ SINH ĐẾN 12 THÁNG TUỔI",
            description: "Trẻ cần được tiêm vắc xin và dùng lịch để có khả năng thể bảo vệ trước khi tiếp xúc với các mầm bệnh nguy hiểm.",
            originalPrice: "19,154,550đ",
            discountedPrice: "17,293,350đ",
            saving: "1,861,200đ",
            vaccines: [
                {
                    disease: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib và viêm gan B (Vắc xin 6.1)",
                    name: "HEXAXIM",
                    origin: "Pháp",
                    doses: 3
                },
                {
                    disease: "Rota virus",
                    name: "ROTARIX",
                    origin: "Bỉ",
                    doses: 2
                },
                {
                    disease: "Các bệnh do phế cầu (Viêm phổi, Viêm tai giữa, Viêm màng não)",
                    name: "SYNFLORIX",
                    origin: "Bỉ",
                    doses: 4
                },
                {
                    disease: "Cúm mùa",
                    name: "VAXIGRIP TETRA",
                    origin: "Pháp",
                    doses: 2
                },
                {
                    disease: "Sởi – Quai bị – Rubella",
                    name: "PRIORIX",
                    origin: "Bỉ",
                    doses: 2
                },
                {
                    disease: "Viêm não Nhật Bản",
                    name: "IMOJEV",
                    origin: "Thái Lan",
                    doses: 1
                },
                {
                    disease: "Viêm màng não mô cầu ACYW",
                    name: "MENACTRA",
                    origin: "Mỹ",
                    doses: 2
                },
                {
                    disease: "Thủy đậu",
                    name: "VARILRIX",
                    origin: "Bỉ",
                    doses: 2
                },
                {
                    disease: "Viêm gan A+B",
                    name: "TWINRIX",
                    origin: "Bỉ",
                    doses: 1
                }
            ]
        },
        {
            id: 2,
            title: "GÓI DÀNH CHO TRẺ SƠ SINH ĐẾN 24 THÁNG TUỔI",
            description: "Trẻ cần được tiêm vắc xin và dùng lịch để có khả năng thể bảo vệ trước khi tiếp xúc với các mầm bệnh nguy hiểm.",
            originalPrice: "22,865,150đ",
            discountedPrice: "20,852,650đ",
            saving: "2,012,500đ",
            vaccines: [
                {
                    disease: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib và viêm gan B (Vắc xin 6.1)",
                    name: "INFANRIX HEXA",
                    origin: "Bỉ",
                    doses: 4
                },
                {
                    disease: "Rota virus",
                    name: "ROTARIX",
                    origin: "Bỉ",
                    doses: 2
                },
                {
                    disease: "Các bệnh do phế cầu (Viêm phổi, Viêm tai giữa, Viêm màng não)",
                    name: "SYNFLORIX",
                    origin: "Bỉ",
                    doses: 4
                },
                {
                    disease: "Cúm mùa",
                    name: "INFLUVAC TETRA",
                    origin: "Hà Lan",
                    doses: 3
                },
                {
                    disease: "Sởi – Quai bị – Rubella",
                    name: "PRIORIX",
                    origin: "Bỉ",
                    doses: 2
                },
                {
                    disease: "Viêm não Nhật Bản",
                    name: "IMOJEV",
                    origin: "Thái Lan",
                    doses: 2
                },
                {
                    disease: "Viêm màng não mô cầu ACYW",
                    name: "MENACTRA",
                    origin: "Mỹ",
                    doses: 2
                },
                {
                    disease: "Thủy đậu",
                    name: "VARILRIX",
                    origin: "Bỉ",
                    doses: 2
                },
                {
                    disease: "Viêm gan A+B",
                    name: "TWINRIX",
                    origin: "Bỉ",
                    doses: 2
                },
                {
                    disease: "Thương Hàn",
                    name: "TYPHIM VI",
                    origin: "Pháp",
                    doses: 1
                },
                {
                    disease: "Tả",
                    name: "MORCVAX",
                    origin: "Việt Nam",
                    doses: 2
                }
            ]
        }
    ];

    // Tạo danh sách vaccine từ các gói
    const vaccineList = [
        "Bạch hầu, ho gà, uốn ván, bại liệt, Hib và viêm gan B (HEXAXIM - Pháp)",
        "Rota virus (ROTARIX - Bỉ)",
        "Các bệnh do phế cầu - Viêm phổi, Viêm tai giữa, Viêm màng não (SYNFLORIX - Bỉ)",
        "Cúm mùa (VAXIGRIP TETRA - Pháp)",
        "Sởi – Quai bị – Rubella (PRIORIX - Bỉ)",
        "Viêm não Nhật Bản (IMOJEV - Thái Lan)",
        "Viêm màng não mô cầu ACYW (MENACTRA - Mỹ)",
        "Thủy đậu (VARILRIX - Bỉ)",
        "Viêm gan A+B (TWINRIX - Bỉ)",
        // Thêm các vaccine từ gói 24 tháng
        "Bạch hầu, ho gà, uốn ván, bại liệt, Hib và viêm gan B (INFANRIX HEXA - Bỉ)",
        "Cúm mùa (INFLUVAC TETRA - Hà Lan)",
        "Thương Hàn (TYPHIM VI - Pháp)",
        "Tả (MORCVAX - Việt Nam)"
    ];

    // Thêm các filter options
    const filterOptions = ["Tất cả", "Phòng bệnh", "Độ tuổi"];

    const handleVaccineSelect = (e, vaccine) => {
        e.preventDefault(); // Ngăn chặn form submit
        e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
        
        const newSelectedVaccines = selectedVaccines.includes(vaccine)
            ? selectedVaccines.filter(v => v !== vaccine)
            : [...selectedVaccines, vaccine];
        
        setSelectedVaccines(newSelectedVaccines);
    };

    // Component Modal chọn vaccine
    const VaccineSelectionModal = () => (
        <div className="vaccine-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Chọn Vắc xin phòng bệnh</h3>
                    <p>Quý khách có thể chọn 1 hoặc nhiều Vắc xin để được tư vấn.</p>
                    <button className="close-btn" onClick={() => setShowVaccineModal(false)}>×</button>
                </div>

                <div className="search-section">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm nhanh theo tên bệnh hoặc gói tiêm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-options">
                        <span>Lọc theo:</span>
                        {filterOptions.map(option => (
                            <button 
                                key={option} 
                                className={`filter-btn ${option === 'Tất cả' ? 'active' : ''}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="vaccine-list">
                    {vaccineList
                        .filter(vaccine => 
                            vaccine.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((vaccine, index) => (
                            <div key={index} className="vaccine-item" onClick={(e) => e.preventDefault()}>
                                <div className="vaccine-info">
                                    <input
                                        type="checkbox"
                                        id={`vaccine-${index}`}
                                        checked={selectedVaccines.includes(vaccine)}
                                        onChange={(e) => handleVaccineSelect(e, vaccine)}
                                    />
                                    <label htmlFor={`vaccine-${index}`} className="vaccine-name">
                                        {vaccine}
                                    </label>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );

    // Hàm xử lý khi click đăng ký mua gói
    const handlePackageSelect = (packageId) => {
        // Lấy danh sách vaccine từ gói đã chọn
        const selectedPackage = vaccinePackages.find(pkg => pkg.id === packageId);
        const packageVaccines = selectedPackage.vaccines.map(vaccine => 
            `${vaccine.disease} (${vaccine.name} - ${vaccine.origin})`
        );
        
        // Cập nhật danh sách vaccine đã chọn
        setSelectedVaccines(packageVaccines);
        
        // Scroll đến phần thông tin tiêm chủng
        vaccinationInfoRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Component Modal xác nhận đăng ký
    const ConfirmationModal = () => (
        <div className="confirmation-modal">
            <div className="confirm-content">
                <h2>Xác nhận thông tin đăng ký</h2>
                
                <div className="confirm-section">
                    <h3>
                        <FaUser className="confirm-icon" />
                        Thông tin người đăng ký
                    </h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Họ và tên:</span>
                            <span className="value">{formData.fullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Ngày sinh:</span>
                            <span className="value">{formData.birthDate}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Giới tính:</span>
                            <span className="value">{formData.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                        </div>
                    </div>
                </div>

                <div className="confirm-section">
                    <h3>
                        <FaMapMarkerAlt className="confirm-icon" />
                        Địa điểm tiêm chủng
                    </h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Trung tâm:</span>
                            <span className="value">
                                {centers.find(c => c.id === selectedCenter)?.name}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Địa chỉ:</span>
                            <span className="value">
                                {centers.find(c => c.id === selectedCenter)?.address}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="confirm-section">
                    <h3>
                        <FaCalendarAlt className="confirm-icon" />
                        Thông tin tiêm chủng
                    </h3>
                    <div className="selected-vaccines-preview">
                        <span className="label">Vắc xin đã chọn:</span>
                        {selectedVaccines.map((vaccine, index) => (
                            <div key={index} className="vaccine-preview-item">
                                {vaccine}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="confirm-actions">
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="button" 
                        className="confirm-btn"
                        onClick={() => {
                            // Xử lý thanh toán ở đây
                            console.log('Proceeding to payment...');
                        }}
                    >
                        Xác nhận thanh toán
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="registration-page">
            {/* Header */}
            <div className="header">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src="https://i.gyazo.com/f738ee4c4bf9e15d9fa2239bbb11fcc6.png" alt="VNVC Logo" />
                </div>
                <div className="header-actions">
                    <div className="hotline">
                        Hotline: 028 7102 6595
                        <div className="sub-text">Mở cửa 7h30 - 17h00 / T2 - CN xuyên trưa*</div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="back-button" onClick={() => navigate('/')}>
                <FaArrowLeft /> Quay lại trang chủ
            </div>

            {/* Registration Form */}
            <div className="registration-container">
                <h1 className="registration-title">
                    <FaCalendarAlt className="title-icon" />
                    Đăng ký & đặt lịch tiêm chủng ngay
                </h1>
                <p className="registration-subtitle">
                    Mời Quý khách đăng ký thông tin tiêm chủng để tiết kiệm thời gian khi đến trung tâm làm thủ tục và hưởng thêm nhiều chính sách ưu đãi khác.
                </p>

                <div className="vaccine-packages">
                    {vaccinePackages.map((pkg) => (
                        <div key={pkg.id} className="vaccine-package">
                            <div className="package-header">
                                <h3>{pkg.title}</h3>
                                <p>{pkg.description}</p>
                                <div className="package-price">
                                    <div className="price-info">
                                        <span className="original-price">{pkg.originalPrice}</span>
                                        <span className="discounted-price">{pkg.discountedPrice}</span>
                                    </div>
                                    <div className="saving">Tiết kiệm: {pkg.saving}</div>
                                </div>
                            </div>
                            <div className="package-content">
                                <table className="vaccine-table">
                                    <thead>
                                        <tr>
                                            <th>Phòng bệnh</th>
                                            <th>Tên vắc xin</th>
                                            <th>Nước sản xuất</th>
                                            <th>Số mũi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pkg.vaccines.map((vaccine, index) => (
                                            <tr key={index}>
                                                <td>{vaccine.disease}</td>
                                                <td>{vaccine.name}</td>
                                                <td>{vaccine.origin}</td>
                                                <td>{vaccine.doses}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="package-actions">
                                    <button 
                                        type="button" 
                                        className="register-package-btn"
                                        onClick={() => handlePackageSelect(pkg.id)}
                                    >
                                        <FaCalendarAlt className="btn-icon" />
                                        Đăng ký mua gói
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-section">
                        <h2>
                            <FaUser className="section-icon" />
                            Thông tin người tiêm
                        </h2>

                        <div className="form-row single-column">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row single-column">
                            <div className="form-group">
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    placeholder="Ngày sinh"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group gender-group">
                                <label>Giới tính:</label>
                                <div className="gender-options">
                                    <label className="gender-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === 'male'}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span>Nam</span>
                                    </label>
                                    <label className="gender-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === 'female'}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span>Nữ</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>
                            <FaMapMarkerAlt className="section-icon" />
                            Chọn trung tâm tiêm chủng
                        </h2>
                        <div className="form-row single-column">
                            <div className="form-group">
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    required
                                    className="province-select"
                                >
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    {provinces.map(province => (
                                        <option key={province.id} value={province.id}>
                                            {province.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row single-column">
                            <div className="form-group">
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.province}
                                    className="province-select"
                                >
                                    <option value="">Chọn Quận/Huyện</option>
                                    {districts.map(district => (
                                        <option key={district.id} value={district.id}>
                                            {district.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="vaccination-centers">
                            {centers.map((center) => (
                                <div key={center.id} className="center-option">
                                    <input
                                        type="radio"
                                        name="center"
                                        id={`center-${center.id}`}
                                        value={center.id}
                                        checked={selectedCenter === center.id}
                                        onChange={(e) => setSelectedCenter(e.target.value)}
                                        required
                                    />
                                    <label htmlFor={`center-${center.id}`}>
                                        <div className="center-info">
                                            <h4>{center.name}</h4>
                                            <p>Địa chỉ: {center.address}</p>
                                            <div className="center-status">
                                                <span className="status-open">{center.status}</span>
                                                <span className="opening-time">• Mở cửa lúc {center.openTime}</span>
                                            </div>
                                        </div>
                                        <button type="button" className="view-map">
                                            <FaMapMarkerAlt />
                                            Xem chỉ đường
                                        </button>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-section" ref={vaccinationInfoRef}>
                        <h2>
                            <FaCalendarAlt className="section-icon" />
                            Thông tin tiêm chủng
                        </h2>

                        <div className="form-row single-column">
                            <div className="form-group">
                                <button 
                                    type="button" 
                                    className="vaccine-select-btn"
                                    onClick={() => setShowVaccineModal(true)}
                                >
                                    Chọn vắc xin phòng bệnh
                                </button>
                            </div>
                        </div>

                        {selectedVaccines.length > 0 && (
                            <div className="selected-vaccines">
                                <h4>Tôi cần tư vấn các Vắc xin sau:</h4>
                                <div className="selected-vaccines-list">
                                    {selectedVaccines.map((vaccine, index) => (
                                        <div key={index} className="selected-vaccine-item">
                                            <span>{vaccine}</span>
                                            <button 
                                                type="button" 
                                                className="remove-vaccine"
                                                onClick={() => {
                                                    setSelectedVaccines(prev => 
                                                        prev.filter(v => v !== vaccine)
                                                    );
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    type="button" 
                                    className="add-more-btn"
                                    onClick={() => setShowVaccineModal(true)}
                                >
                                    Thêm
                                </button>
                            </div>
                        )}

                        <div className="form-row datetime-row">
                            <div className="form-group">
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    className="date-input"
                                    placeholder="Chọn ngày hẹn tiêm"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    name="timeSlot"
                                    className="province-select"
                                    required
                                >
                                    <option value="">Chọn khung giờ</option>
                                    <option value="0730">07:30 - 09:00</option>
                                    <option value="0900">09:00 - 10:30</option>
                                    <option value="1030">10:30 - 12:00</option>
                                    <option value="1330">13:30 - 15:00</option>
                                    <option value="1500">15:00 - 16:30</option>
                                </select>
                            </div>
                        </div>

                        <div className="vaccination-note">
                            <p>
                                <strong>Lưu ý:</strong> Quý khách vui lòng đến đúng giờ hẹn để được phục vụ tốt nhất. 
                                Thời gian khám sàng lọc và tư vấn trước tiêm khoảng 30 phút.
                            </p>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            Đăng ký ngay
                        </button>
                    </div>
                </form>
            </div>

            {showVaccineModal && <VaccineSelectionModal />}
            {showConfirmModal && <ConfirmationModal />}
        </div>
    );
};

export default VaccineRegistration; 