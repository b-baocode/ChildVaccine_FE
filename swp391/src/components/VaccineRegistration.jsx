import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/VaccineRegistration.css';
import vaccineService from '../service/vaccineService';
import appointmentService from '../service/appointmentService';
import customerService from '../service/customerService';
import { useAuth } from '../context/AuthContext';
import sessionService from '../service/sessionService';

const VaccineRegistration = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        childProfile: '',
        appointmentDate: '',
        timeSlot: '',
        vaccineType: '',
        selectedItem: null,
        appointmentId: '' // Add this
    });

    const [formErrors, setFormErrors] = useState({
        childProfile: '',
        appointmentDate: '',
        timeSlot: '',
        selectedItem: ''
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
    const [selectedItemPrice, setSelectedItemPrice] = useState(0);
    const [slotAvailability, setSlotAvailability] = useState({});
    const [checking, setChecking] = useState(false);
    const [slotError, setSlotError] = useState('');

    // Fetch data khi component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get session data
                const sessionData = await sessionService.checkSession();
                console.log('🔑 Session Data:', sessionData);
                
                if (!sessionData) {
                    throw new Error('No session data found');
                }
    
                // Set customer info from session
                const userInfo = {
                    cusId: sessionData.body.cusId, // Dữ liệu nằm trong body
                    fullName: sessionData.body.user.fullName, // Truy cập user bên trong body
                    phone: sessionData.body.user.phone,
                    address: sessionData.body.address
                };
                
                setCustomerInfo(userInfo);
                setGuardianInfo(userInfo);
    
                // Fetch children using session cusId
                const children = await customerService.getCustomerChildren(sessionData.body.cusId);
                console.log('🔑 ChildChild Data:', children);
                setChildProfiles(children);
    
                // Fetch vaccines and packages
                const [vaccinesData, packagesData] = await Promise.all([
                    vaccineService.getVaccines(),
                    vaccineService.getVaccinePackages()
                ]);
                setVaccines(vaccinesData);
                setPackages(packagesData);
    
            } catch (err) {
                console.error('❌ Error:', err);
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

    // In VaccineRegistration.jsx
    useEffect(() => {
        if (location.state && location.state.selectedItem) {
            const { selectedItem, selectedType } = location.state;
            
            console.log('📦 Pre-selected item from navigation:', {
                item: selectedItem,
                type: selectedType
            });
            
            setSelectedType(selectedType);
            
            // Update formData to include the selected item
            setFormData(prev => ({
                ...prev,
                vaccineType: selectedType,
                selectedItem: selectedType === 'single' ? selectedItem.vaccineId : selectedItem.packageId
            }));
            
            // Set the selected item name for display
            setSelectedItemName(selectedItem.name);
            setSelectedItemPrice(selectedItem.price);
        }
    }, [location.state]);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    
        if (name === 'appointmentDate') {
            // Reset time slot when date changes
            setFormData(prevState => ({
                ...prevState,
                timeSlot: ''
            }));
            setSlotError('');
        }
    
        if (name === 'timeSlot' && value && formData.appointmentDate) {
            await checkSlotAvailability(formData.appointmentDate, value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const currentSlot = slotAvailability[`${formData.appointmentDate}-${formData.timeSlot}`];
    
        // Add date validation
        const selectedDate = new Date(formData.appointmentDate);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
    
        // Clear previous error
        setError('');
        
        // Validate time slot
        if (!currentSlot) {
            setSlotError('Vui lòng chọn khung giờ hợp lệ');
            return false;
        }
        
        if (currentSlot.isFull) {
            setSlotError('Khung giờ này đã đầy. Vui lòng chọn khung giờ khác.');
            return false;
        }
    
        if (selectedDate < tomorrow) {
            setError('Vui lòng chọn ngày từ ngày mai trở đi');
            return false;
        }
    
        // If all validations pass, show confirmation modal
        setShowConfirmModal(true);
    };

    const handleConfirmRegistration = async () => {
        try {
            // Format time slot from "0730" to "07:30:00"
            const formatTimeSlot = (timeSlot) => {
                const hour = timeSlot.substring(0, 2);
                const minute = timeSlot.substring(2);
                return `${hour}:${minute}:00`;
            };

            // Reset previous errors
            setFormErrors({
                childProfile: '',
                appointmentDate: '',
                timeSlot: '',
                selectedItem: ''
            });
            
            // Validate all required fields
            const newErrors = {};
            if (!formData.childProfile) {
                newErrors.childProfile = 'Vui lòng chọn hồ sơ trẻ';
            }
            if (!formData.appointmentDate) {
                newErrors.appointmentDate = 'Vui lòng chọn ngày hẹn';
            }
            if (!formData.timeSlot) {
                newErrors.timeSlot = 'Vui lòng chọn khung giờ';
            }
            if (!formData.selectedItem) {
                newErrors.selectedItem = 'Vui lòng chọn vắc xin/gói vắc xin';
            }

            // If there are any errors, show them and return
            if (Object.keys(newErrors).length > 0) {
                setFormErrors(newErrors);
                setShowConfirmModal(false);
                return;
            }

            // Prepare registration data
            const registrationData = {
                customerId: guardianInfo.cusId,
                childId: formData.childProfile,
                vaccineId: selectedType === 'single' ? formData.selectedItem : null,
                packageId: selectedType === 'package' ? formData.selectedItem : null,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formatTimeSlot(formData.timeSlot)
            };

            console.log('Sending registration data:', registrationData);

            const result = await appointmentService.registerVaccination(registrationData);
        
            if (result.ok) {
                setShowConfirmModal(false);
                setShowSuccessModal(true);
                setFormData(prev => ({
                    ...prev,
                    appointmentId: result.appointment.appId
                }));
                setTimeout(() => {
                    setFormData({
                        childProfile: '',
                        appointmentDate: '',
                        timeSlot: '',
                        vaccineType: '',
                        selectedItem: null,
                        appointmentId: ''
                    });
                    setShowSuccessModal(false);
                    navigate('/');
                }, 2000);
            } else {
                setError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.');
                setShowConfirmModal(false);
            }
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
            setShowConfirmModal(false);
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

    const checkSlotAvailability = async (date, timeSlot) => {
        if (!date || !timeSlot) return;
        
        setChecking(true);
        setSlotError('');
        
        try {
            const availability = await appointmentService.checkSlotAvailability(date, timeSlot);
            setSlotAvailability(prev => ({
                ...prev,
                [`${date}-${timeSlot}`]: availability
            }));
            
            if (availability.isFull) {
                setSlotError('Khung giờ này đã đạt giới hạn đặt lịch. Vui lòng chọn khung giờ khác.');
            }
        } catch (error) {
            setSlotError('Không thể kiểm tra tình trạng khung giờ. Vui lòng thử lại.');
        } finally {
            setChecking(false);
        }
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

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getSelectedChildName = () => {
        const selectedChild = childProfiles.find(child => child.childId === formData.childProfile);
        return selectedChild ? selectedChild.fullName : 'Không tìm thấy';
    };

    // Xử lý chọn vaccine/gói cụ thể
    const handleSelectItem = (item) => {
        const itemId = selectedType === 'single' ? item.vaccineId : item.packageId;
        setFormData(prev => ({
            ...prev,
            selectedItem: prev.selectedItem === itemId ? null : itemId
        }));
        setSelectedItemName(item.name);
        setSelectedItemPrice(item.price);
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
                            <span className="label">Tên trẻ:</span>
                            <span className="value">
                                {formData.childProfile} - {getSelectedChildName()}
                            </span>
                        </div>
                        <div key="selected-item" className="info-item">
                            <span className="label">Vắc xin đã chọn:</span>
                            <span className="value">{selectedItemName}</span>
                        </div>
                        <div key="selected-price" className="info-item">
                            <span className="label">Giá tiền:</span>
                            <span className="value price-value">
                                {Number(selectedItemPrice).toLocaleString('vi-VN')}đ
                            </span>
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
                {formData.appointmentId && (
                    <p>Mã cuộc hẹn: <strong>{formData.appointmentId}</strong></p>
                )}
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
    const renderChildProfiles = () => (
        <select
            name="childProfile"
            value={formData.childProfile}
            onChange={handleInputChange}
            required
            className="profile-select"
        >
            <option value="">
                {childProfiles.length === 0 ? '-- Không có hồ sơ trẻ --' : '-- Chọn hồ sơ trẻ --'}
            </option>
            {childProfiles.map(child => (
                <option key={child.childId} value={child.childId}>
                    {child.childId} - {child.fullName}
                </option>
            ))}
        </select>
    );

    // Phần JSX hiển thị danh sách
    const renderItemList = () => {
        const items = selectedType === 'single' ? vaccines : packages;
        
        console.log('🎯 Rendering items:', {
            selectedType,
            itemsCount: items.length,
            items: items.map(item => ({
                id: selectedType === 'single' ? item.vaccineId : item.packageId,
                name: item.name,
                price: item.price,
                shots: selectedType === 'single' ? item.shot : 'N/A',
                isSelected: formData.selectedItem === (selectedType === 'single' ? item.vaccineId : item.packageId)
            }))
        });
        
        return (
            <div className="item-grid">
                {items.map(item => {
                    const itemId = selectedType === 'single' ? item.vaccineId : item.packageId;
                    console.log(`📦 Rendering item: ${item.name}`, {
                        id: itemId,
                        description: item.description,
                        price: item.price,
                        shots: selectedType === 'single' ? item.shot : 'N/A'
                    });
    
                    return (
                        <div 
                            key={itemId}
                            className={`item-card ${formData.selectedItem === itemId ? 'selected' : ''}`}
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
                    );
                })}
            </div>
        );
    };

    // Update the time slot render function
    const renderTimeSlots = () => {
        const timeSlots = [
            { value: "0730", label: "07:30 - 08:00" },
            { value: "0800", label: "08:00 - 08:30" },
            { value: "0830", label: "08:30 - 09:00" },
            { value: "0900", label: "09:00 - 09:30" },
            { value: "0930", label: "09:30 - 10:00" },
            { value: "1000", label: "10:00 - 10:30" },
            { value: "1030", label: "10:30 - 11:00" },
            { value: "1100", label: "11:00 - 11:30" },
            { value: "1130", label: "11:30 - 12:00" },
            { value: "1330", label: "13:30 - 14:00" },
            { value: "1400", label: "14:00 - 14:30" },
            { value: "1430", label: "14:30 - 15:00" },
            { value: "1500", label: "15:00 - 15:30" },
            { value: "1530", label: "15:30 - 16:00" },
            { value: "1600", label: "16:00 - 16:30" },
            { value: "1630", label: "16:30 - 17:00" }
        ];
    
        // Lọc các khung giờ để chỉ hiển thị các khung giờ còn trống
        const availableTimeSlots = formData.appointmentDate 
            ? timeSlots.filter(slot => {
                const availability = slotAvailability[`${formData.appointmentDate}-${slot.value}`];
                // Nếu chưa kiểm tra availability hoặc slot còn trống thì hiển thị
                return !availability || (availability && availability.currentCount < availability.maxAllowed);
            })
            : timeSlots;
        
        return (
            <div className="time-field">
                <label>Chọn khung giờ</label>
                <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.appointmentDate || checking}
                    className={slotError ? 'error' : ''}
                >
                    <option value="">-- Chọn giờ --</option>
                    {availableTimeSlots.map(slot => {
                        const availability = formData.appointmentDate ? 
                            slotAvailability[`${formData.appointmentDate}-${slot.value}`] : null;
                        
                        return (
                            <option 
                                key={slot.value} 
                                value={slot.value}
                            >
                                {slot.label}
                                {availability && ` (${availability.maxAllowed - availability.currentCount} slot còn trống)`}
                            </option>
                        );
                    })}
                </select>
                {checking && <div className="checking-message">Đang kiểm tra slot...</div>}
                {slotError && <div className="error-message">{slotError}</div>}
                {formData.appointmentDate && availableTimeSlots.length === 0 && (
                    <div className="no-slots-message">Không có khung giờ trống cho ngày đã chọn</div>
                )}
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
                                {formErrors.childProfile && (
                                    <div className="error-message">{formErrors.childProfile}</div>
                                )}
                                {/* ...existing buttons... */}
                            </div>
                        </div>
    
                        <div className="service-info">
                            {formErrors.selectedItem && (
                                <div className="error-message">{formErrors.selectedItem}</div>
                            )}
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
                                {formErrors.appointmentDate && (
                                    <div className="error-message">{formErrors.appointmentDate}</div>
                                )}
                                    <label>Chọn ngày hẹn tiêm</label>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        min={getTomorrowDate()}
                                        required
                                    />
                                </div>
                                {formErrors.timeSlot && (
                                    <div className="error-message">{formErrors.timeSlot}</div>
                                )}                               
                                {renderTimeSlots()}
                            </div>
                        </div>
    
                        {error && <div className="error-message general-error">{error}</div>}

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