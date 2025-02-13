import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import '../../styles/CusStyles/AddChildForm.css';

const AddChildForm = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [childInfo, setChildInfo] = useState({
    name: '',
    birthday: '',
    gender: 'male',
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    medicalConditions: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic thêm hồ sơ trẻ ở đây
    console.log('Child info submitted:', childInfo);
    // Hiển thị thông báo thành công
    setShowSuccessMessage(true);
    // Sau khi thêm thành công, quay lại trang trước đó sau 2 giây
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cập nhật hàm xử lý nút quay lại
  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó trong history stack
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

      <form onSubmit={handleSubmit} className="add-child-form">
        <div className="form-section">
          <h3>Thông tin cơ bản</h3>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={childInfo.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="birthday"
                value={childInfo.birthday}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={childInfo.gender}
                onChange={handleChange}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
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
                required
              />
            </div>
            <div className="form-group">
              <label>Cân nặng (kg)</label>
              <input
                type="number"
                name="weight"
                value={childInfo.weight}
                onChange={handleChange}
                required
              />
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
              placeholder="Liệt kê các dị ứng..."
            />
          </div>

          <div className="form-group">
            <label>Tiền sử bệnh</label>
            <textarea
              name="medicalConditions"
              value={childInfo.medicalConditions}
              onChange={handleChange}
              placeholder="Các bệnh đã mắc..."
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