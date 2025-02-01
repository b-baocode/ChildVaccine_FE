import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import '../styles/CusStyles/AddChildForm.css';

const AddChildForm = () => {
  const navigate = useNavigate();
  const [childInfo, setChildInfo] = useState({
    name: '',
    birthday: '',
    gender: 'male',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    parentName: '',
    parentPhone: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic thêm hồ sơ trẻ ở đây
    console.log('Child info submitted:', childInfo);
    // Sau khi thêm thành công
    navigate('/profile');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-child-container">
      <div className="form-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <FaArrowLeft /> Quay lại
        </button>
        <h2>Thêm Hồ Sơ Trẻ</h2>
      </div>

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

        <div className="form-section">
          <h3>Thông tin liên hệ</h3>
          <div className="form-group">
            <label>Tên phụ huynh</label>
            <input
              type="text"
              name="parentName"
              value={childInfo.parentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="parentPhone"
              value={childInfo.parentPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <textarea
              name="address"
              value={childInfo.address}
              onChange={handleChange}
              required
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