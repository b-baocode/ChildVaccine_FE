import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/VaccineRegistration.css';

const VaccineRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        childProfile: '',
        appointmentDate: '',
        timeSlot: '',
        vaccineType: ''
    });
    const [selectedVaccineType, setSelectedVaccineType] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const handleVaccineTypeSelect = (type) => {
        setSelectedVaccineType(type);
        setFormData(prev => ({
            ...prev,
            vaccineType: type
        }));
    };

    const handleConfirmRegistration = () => {
        console.log('Đăng ký thành công:', formData);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        // Navigate back to the homepage after 2 seconds
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        setFormData({
            childProfile: '',
            appointmentDate: '',
            timeSlot: '',
            vaccineType: ''
        });
        setSelectedVaccineType('');
    };

    const ConfirmationModal = () => (
        <div className="confirmation-modal">
            <div className="modal-content">
                <h2>Xác nhận thông tin đăng ký</h2>
                <div className="confirm-section">
                    <h3>Thông tin người giám hộ</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">ID:</span>
                            <span className="value">GH001</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Họ và tên:</span>
                            <span className="value">Nguyễn Văn A</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Số điện thoại:</span>
                            <span className="value">0123456789</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Địa chỉ:</span>
                            <span className="value">123 Đường ABC, Quận 1, TP.HCM</span>
                        </div>
                    </div>
                </div>
                <div className="confirm-section">
                    <h3>Thông tin đăng ký tiêm</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Hồ sơ trẻ:</span>
                            <span className="value">{formData.childProfile}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Loại vắc xin:</span>
                            <span className="value">
                                {selectedVaccineType === 'package' ? 'Vắc xin gói' : 'Vắc xin lẻ'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Ngày hẹn:</span>
                            <span className="value">{formData.appointmentDate}</span>
                        </div>
                        <div className="info-item">
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

    return (
        <div className="registration-form">
            <button className="back-btn" onClick={() => navigate('/')}>
                <FaArrowLeft /> Quay lại trang chủ
            </button>
            <h2>Thông Tin Người Giám Hộ</h2>
            <div className="guardian-info">
                <div className="info-row">
                    <div className="info-field">
                        <label>ID:</label>
                        <div className="info-value">GH001</div>
                    </div>
                    <div className="info-field">
                        <label>Họ và tên:</label>
                        <div className="info-value">Nguyễn Văn A</div>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-field">
                        <label>Số điện thoại:</label>
                        <div className="info-value">0123456789</div>
                    </div>
                    <div className="info-field">
                        <label>Địa chỉ:</label>
                        <div className="info-value">123 Đường ABC, Quận 1, TP.HCM</div>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Chọn Hồ Sơ Trẻ:</label>
                    <div className="profile-selection">
                        <select
                            name="childProfile"
                            value={formData.childProfile}
                            onChange={handleInputChange}
                            required
                            className="profile-select"
                        >
                            <option value="">-- Chọn hồ sơ trẻ --</option>
                            <option value="CH001">CH001 - Nguyễn Văn A</option>
                            <option value="CH002">CH002 - Nguyễn Thị C</option>
                            <option value="CH003">CH003 - Trần Văn B</option>
                        </select>
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
                                className={`vaccine-btn ${selectedVaccineType === 'package' ? 'active' : ''}`}
                                onClick={() => handleVaccineTypeSelect('package')}
                            >
                                Vắc xin gói
                            </button>
                            <button
                                type="button"
                                className={`vaccine-btn ${selectedVaccineType === 'single' ? 'active' : ''}`}
                                onClick={() => handleVaccineTypeSelect('single')}
                            >
                                Vắc xin lẻ
                            </button>
                        </div>
                    </div>
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
        </div>
    );
};

export default VaccineRegistration;