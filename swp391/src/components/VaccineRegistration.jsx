import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/VaccineRegistration.css';
import vaccineService from '../service/vaccineService';
import appointmentService from '../service/appointmentService';
import customerService from '../service/customerService';
import { useAuth } from '../context/AuthContext';
import sessionService from '../service/sessionService';

const VaccineRegistration = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        childProfile: '',
        appointmentDate: '',
        timeSlot: '',
        vaccineType: '', // 'single' hoặc 'package'
        selectedItem: null // ID của vaccine/gói được chọn
    });

    // State cho dữ liệu chính
    const [vaccines, setVaccines] = useState([]); // Danh sách vaccine từ API
    const [packages, setPackages] = useState([]); // Danh sách gói vaccine từ API
    const [customerInfo, setCustomerInfo] = useState(null);
    const [childProfiles, setChildProfiles] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [error, setError] = useState(null); // Lưu thông tin lỗi
    const { user } = useAuth();
    const [guardianInfo, setGuardianInfo] = useState({
        cusId: '',
        fullName: '',
        phone: '',
        address: ''
    });

    // State cho UI/UX
    const [selectedType, setSelectedType] = useState(''); // 'single' or 'package'
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Hiển thị modal xác nhận
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Hiển thị modal thành công
    const [selectedItemName, setSelectedItemName] = useState('');

    // Fetch data khi component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const sessionData = await sessionService.checkSession();
            
                // Set guardian info from session
                if (sessionData) {
                    setGuardianInfo({
                        cusId: sessionData.cusId,
                        fullName: sessionData.user.fullName,
                        phone: sessionData.user.phone,
                        address: sessionData.address
                    });
                }
                
                // Fetch customer info
                const customer = await customerService.getCurrentCustomer();
                setCustomerInfo(customer);

                // Fetch child profiles
                const children = await customerService.getCustomerChildren(customer.cusId);
                setChildProfiles(children);

                // Fetch vaccines and packages
                const [vaccinesData, packagesData] = await Promise.all([
                    vaccineService.getVaccines(),
                    vaccineService.getVaccinePackages()
                ]);
                setVaccines(vaccinesData);
                setPackages(packagesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

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

    const handleConfirmRegistration = async () => {
        try {
            const response = await appointmentService.registerVaccination(formData);
            console.log('Registration successful:', response);
            setShowConfirmModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Registration failed:', err);
            // Xử lý lỗi ở đây
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        setFormData({
            childProfile: '',
            appointmentDate: '',
            timeSlot: '',
            vaccineType: ''
        });
        setSelectedType(''); // Updated from setSelectedVaccineType
    };

    // Xử lý khi chọn loại vaccine
    const handleVaccineTypeSelect = (type) => {
        setSelectedType(type);
        setFormData(prev => ({
            ...prev,
            vaccineType: type,
            selectedItem: null // Reset selected item when switching types
        }));
    };

    // Xử lý chọn vaccine/gói cụ thể
    const handleSelectItem = (item) => {
        const itemId = selectedType === 'single' ? item.vaccineId : item.packageId;
        setFormData(prev => ({
            ...prev,
            selectedItem: prev.selectedItem === itemId ? null : itemId
        }));
        setSelectedItemName(item.name);
    };

    const ConfirmationModal = () => (
        <div className="confirmation-modal">
            <div className="modal-content">
                <h2>Xác nhận thông tin đăng ký</h2>
                <div className="confirm-section">
                    <h3>Thông tin người giám hộ</h3>
                    <div className="info-grid">
                        <div key="guardian-id" className="info-item">
                            <span className="label">ID:</span>
                            <span className="value">{guardianInfo.cusId}</span>
                        </div>
                        <div key="guardian-name" className="info-item">
                            <span className="label">Họ và tên:</span>
                            <span className="value">{guardianInfo.fullName}</span>
                        </div>
                        <div key="guardian-phone" className="info-item">
                            <span className="label">Số điện thoại:</span>
                            <span className="value">{guardianInfo.phone}</span>
                        </div>
                        <div key="guardian-address" className="info-item">
                            <span className="label">Địa chỉ:</span>
                            <span className="value">{guardianInfo.address}</span>
                        </div>
                    </div>
                </div>
                <div className="confirm-section">
                    <h3>Thông tin đăng ký tiêm</h3>
                    <div className="info-grid">
                        <div key="child-profile" className="info-item">
                            <span className="label">Hồ sơ trẻ:</span>
                            <span className="value">{formData.childProfile}</span>
                        </div>
                        <div key="selected-item" className="info-item">
                            <span className="label">Vắc xin đã chọn:</span>
                            <span className="value">{selectedItemName}</span>
                        </div>
                        <div key="appointment-date" className="info-item">
                            <span className="label">Ngày hẹn:</span>
                            <span className="value">{formData.appointmentDate}</span>
                        </div>
                        <div key="time-slot" className="info-item">
                            <span className="label">Khung giờ:</span>
                            <span className="value">
                                {formData.timeSlot === '0730' && '07:30 - 08:00'}
                                {formData.timeSlot === '0800' && '08:00 - 08:30'}
                                {formData.timeSlot === '0830' && '08:30 - 09:00'}
                                {formData.timeSlot === '0900' && '09:00 - 09:30'}
                                {formData.timeSlot === '0930' && '09:30 - 10:00'}
                                {formData.timeSlot === '1000' && '10:00 - 10:30'}
                                {formData.timeSlot === '1030' && '10:30 - 11:00'}
                                {formData.timeSlot === '1100' && '11:00 - 11:30'}
                                {formData.timeSlot === '1130' && '11:30 - 12:00'}
                                {formData.timeSlot === '1330' && '13:30 - 14:00'}
                                {formData.timeSlot === '1400' && '14:00 - 14:30'}
                                {formData.timeSlot === '1430' && '14:30 - 15:00'}
                                {formData.timeSlot === '1500' && '15:00 - 15:30'}
                                {formData.timeSlot === '1530' && '15:30 - 16:00'}
                                {formData.timeSlot === '1600' && '16:00 - 16:30'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="modal-actions">
                    <button
                        className="cancel-btn"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        className="confirm-btn"
                        onClick={handleConfirmRegistration}
                    >
                        Xác nhận đăng ký
                    </button>
                </div>
            </div>
        </div>
    );

    const SuccessModal = () => (
        <div className="success-modal">
            <div className="modal-content success">
                <div className="success-icon">✓</div>
                <h2>Đăng ký thành công!</h2>
                <p>Thông tin đăng ký của bạn đã được ghi nhận.</p>
                <button
                    className="success-btn"
                    onClick={handleSuccessClose}
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    // Cập nhật phần render thông tin guardian
    const renderGuardianInfo = () => {
        if (!customerInfo) return null;
        
        return (
            <div className="guardian-info">
                <div className="info-row">
                    <div className="info-field">
                        <label>ID:</label>
                        <div className="info-value">{customerInfo.cusId}</div>
                    </div>
                    <div className="info-field">
                        <label>Họ và tên:</label>
                        <div className="info-value">{customerInfo.fullName}</div>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-field">
                        <label>Số điện thoại:</label>
                        <div className="info-value">{customerInfo.phone}</div>
                    </div>
                    <div className="info-field">
                        <label>Địa chỉ:</label>
                        <div className="info-value">{customerInfo.address}</div>
                    </div>
                </div>
            </div>
        );
    };

    // Cập nhật phần render child profiles
    const renderChildProfiles = () => {
        return (
            <select
                name="childProfile"
                value={formData.childProfile}
                onChange={handleInputChange}
                required
                className="profile-select"
            >
                <option key="default" value="">-- Chọn hồ sơ trẻ --</option>
                {childProfiles.map(child => (
                    <option key={child.childId} value={child.childId}>
                        {child.childId} - {child.fullName}
                    </option>
                ))}
            </select>
        );
    };

    // Phần JSX hiển thị danh sách
    const renderItemList = () => {
        const items = selectedType === 'single' ? vaccines : packages;
        
        return (
            <div className="item-grid">
                {items.map(item => (
                    <div 
                    key={selectedType === 'single' ? item.vaccineId : item.packageId}
                    className={`item-card ${formData.selectedItem === (selectedType === 'single' ? item.vaccineId : item.packageId) ? 'selected' : ''}`}
                    onClick={() => handleSelectItem(item)}
                    >
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <div className="item-details">
                            <span className="price">
                                {Number(item.price).toLocaleString('vi-VN')} VND
                            </span>
                            {selectedType === 'single' && (
                                <span className="shots">Số mũi: {item.shot}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="registration-form">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">Error: {error}</div>}
            
            {!loading && !error && (
                <>
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <FaArrowLeft /> Quay lại trang chủ
                    </button>
                    <h2>Thông Tin Người Giám Hộ</h2>
                    {renderGuardianInfo()}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Chọn Hồ Sơ Trẻ:</label>
                            <div className="profile-selection">
                                {renderChildProfiles()}
                                <button
                                    type="button"
                                    className="add-profile-btn"
                                    onClick={() => navigate('/add-child', { state: { from: '/vaccine-registration' } })}
                                >
                                    + Thêm Hồ Sơ Trẻ
                                </button>
                            </div>
                        </div>
    
                        <div className="service-info">
                            <h3>THÔNG TIN DỊCH VỤ</h3>
                            <div className="vaccine-type">
                                <label>Loại vắc xin muốn đăng ký:</label>
                                <div className="vaccine-buttons">
                                    <button
                                        type="button"
                                        className={`vaccine-btn ${selectedType === 'package' ? 'active' : ''}`}
                                        onClick={() => handleVaccineTypeSelect('package')}
                                    >
                                        Vắc xin gói
                                    </button>
                                    <button
                                        type="button"
                                        className={`vaccine-btn ${selectedType === 'single' ? 'active' : ''}`}
                                        onClick={() => handleVaccineTypeSelect('single')}
                                    >
                                        Vắc xin lẻ
                                    </button>
                                </div>
                            </div>
    
                            {selectedType && (
                                <div className="item-selection">
                                    <h4>Chọn {selectedType === 'single' ? 'Vắc xin' : 'Gói'}:</h4>
                                    {renderItemList()}
                                </div>
                            )}
    
                            <div className="appointment-time">
                                <div className="time-field">
                                    <label>Chọn ngày hẹn tiêm</label>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="time-field">
                                    <label>Chọn khung giờ</label>
                                    <select
                                        name="timeSlot"
                                        value={formData.timeSlot}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Chọn giờ --</option>
                                        <option value="0730">07:30 - 08:00</option>
                                        <option value="0800">08:00 - 08:30</option>
                                        <option value="0830">08:30 - 09:00</option>
                                        <option value="0900">09:00 - 09:30</option>
                                        <option value="0930">09:30 - 10:00</option>
                                        <option value="1000">10:00 - 10:30</option>
                                        <option value="1030">10:30 - 11:00</option>
                                        <option value="1100">11:00 - 11:30</option>
                                        <option value="1130">11:30 - 12:00</option>
                                        <option value="1330">13:30 - 14:00</option>
                                        <option value="1400">14:00 - 14:30</option>
                                        <option value="1430">14:30 - 15:00</option>
                                        <option value="1500">15:00 - 15:30</option>
                                        <option value="1530">15:30 - 16:00</option>
                                        <option value="1600">16:00 - 16:30</option>
                                    </select>
                                </div>
                            </div>
                        </div>
    
                        <button type="submit" className="submit-btn">
                            XÁC NHẬN ĐĂNG KÝ
                        </button>
                    </form>
    
                    {showConfirmModal && <ConfirmationModal />}
                    {showSuccessModal && <SuccessModal />}
                </>
            )}
        </div>
    );
};

export default VaccineRegistration;