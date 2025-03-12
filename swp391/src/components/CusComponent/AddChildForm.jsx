import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import childService from '../../service/childService';
import sessionService from '../../service/sessionService';
import '../../styles/CusStyles/AddChildForm.css';

const AddChildForm = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [childInfo, setChildInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'MALE',
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    healthNote: ''
  });

  // Fetch session data when the component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await sessionService.checkSession();
        if (!sessionData || !sessionData.body.cusId) {
          setError('Không thể tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.');
        }
      } catch (err) {
        setError('Lỗi khi kiểm tra session: ' + err.message);
      }
    };
    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const sessionData = await sessionService.checkSession();
      const cusId = sessionData.body.cusId;

      if (!cusId) {
        setError('Không thể tìm thấy ID khách hàng. Vui lòng đăng nhập lại.');
        return;
      }

      const genderMapping = {
        MALE: "0",
        FEMALE: "1",
        OTHER: "2"
      };

      const formattedData = {
        ...childInfo,
        height: parseFloat(childInfo.height) || 0,
        weight: parseFloat(childInfo.weight) || 0,
        gender: genderMapping[childInfo.gender] || childInfo.gender
      };

      // Call the service and handle the plain text response
      const response = await childService.addChildProfile(formattedData);
      console.log('Response from addChildProfile:', response); // Should log "Thêm trẻ thành công"

      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate(-1); // Navigate back to the previous page after 2 seconds
      }, 2000);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi thêm hồ sơ trẻ');
      console.error('Error adding child:', err);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Height validation
    if (parseFloat(childInfo.height) > 200) {
      errors.height = 'Chiều cao không được quá 200 cm';
    }
    
    // Weight validation
    if (parseFloat(childInfo.weight) > 100) {
      errors.weight = 'Cân nặng không được quá 100 kg';
    }
    
    // Date of birth validation
    const birthDate = new Date(childInfo.dateOfBirth);
    const year2000 = new Date('2000-12-31');
    if (birthDate <= year2000) {
      errors.dateOfBirth = 'Ngày sinh phải sau năm 2000';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="add-child-container">
      <div className="form-header">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft /> Quay lại
        </button>
        <h2>Thêm Hồ Sơ Trẻ</h2>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          Hồ sơ trẻ đã được lưu thành công!
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="add-child-form">
        <div className="form-section">
          <h3>Thông tin cơ bản</h3>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={childInfo.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={childInfo.dateOfBirth}
                onChange={handleChange}
                required
                max="2025-03-11" // Today's date to prevent future dates
                className={validationErrors.dateOfBirth ? 'input-error' : ''}
              />
              {validationErrors.dateOfBirth && (
                <span className="error-text">{validationErrors.dateOfBirth}</span>
              )}
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={childInfo.gender}
                onChange={handleChange}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Nhóm máu</label>
            <select
              name="bloodType"
              value={childInfo.bloodType}
              onChange={handleChange}
            >
              <option value="">Chọn nhóm máu</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="O">O</option>
              <option value="AB">AB</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Chiều cao (cm)</label>
              <input
                type="number"
                name="height"
                value={childInfo.height}
                onChange={handleChange}
                min="1"
                max="200"
                required
                className={validationErrors.height ? 'input-error' : ''}
              />
              {validationErrors.height && (
                <span className="error-text">{validationErrors.height}</span>
              )}
            </div>
            <div className="form-group">
              <label>Cân nặng (kg)</label>
              <input
                type="number"
                name="weight"
                value={childInfo.weight}
                onChange={handleChange}
                min="0.1"
                max="100"
                required
                className={validationErrors.weight ? 'input-error' : ''}
              />
              {validationErrors.weight && (
                <span className="error-text">{validationErrors.weight}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Thông tin y tế</h3>
          <div className="form-group">
            <label>Dị ứng (nếu có)</label>
            <textarea
              name="allergies"
              value={childInfo.allergies}
              onChange={handleChange}
              placeholder="Các dị ứng nếu có..."
            />
          </div>

          <div className="form-group">
            <label>Ghi chú sức khỏe</label>
            <textarea
              name="healthNote"
              value={childInfo.healthNote}
              onChange={handleChange}
              placeholder="Thông tin sức khỏe khác..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <FaSave /> Lưu hồ sơ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChildForm;