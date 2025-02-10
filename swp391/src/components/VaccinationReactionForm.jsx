import React, { useState } from 'react';
import '../styles/VaccinationReactionForm.css';

const VaccinationReactionForm = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedVaccination, setSelectedVaccination] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');

  // Dữ liệu mẫu - trong thực tế sẽ lấy từ API/database
  const children = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Văn C" },
  ];

  const vaccinations = [
    { id: 1, name: "Vaccine 5 trong 1", date: "2024-03-15" },
    { id: 2, name: "Vaccine Sởi", date: "2024-03-10" },
    { id: 3, name: "Vaccine BCG", date: "2024-03-05" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form
    console.log({
      selectedChild,
      selectedVaccination,
      description,
      severity
    });
  };

  return (
    <div className="form-container">
      <h1>Báo Cáo Phản Ứng Sau Tiêm</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Chọn Hồ Sơ Trẻ:</label>
          <select 
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            required
          >
            <option value="">-- Chọn trẻ --</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {`${child.id} - ${child.name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Chọn Buổi Tiêm:</label>
          <select
            value={selectedVaccination}
            onChange={(e) => setSelectedVaccination(e.target.value)}
            required
          >
            <option value="">-- Chọn buổi tiêm --</option>
            {vaccinations.map(vacc => (
              <option key={vacc.id} value={vacc.id}>
                {`${vacc.id} - ${vacc.name} - ${vacc.date}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mô Tả Phản Ứng:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Nhập mô tả chi tiết về phản ứng sau tiêm..."
          />
        </div>

        <div className="form-group">
          <label>Mức Độ:</label>
          <div className="severity-buttons">
            <button
              type="button"
              className={`severity-btn light ${severity === 'light' ? 'active' : ''}`}
              onClick={() => setSeverity('light')}
            >
              Nhẹ
            </button>
            <button
              type="button"
              className={`severity-btn medium ${severity === 'medium' ? 'active' : ''}`}
              onClick={() => setSeverity('medium')}
            >
              Vừa
            </button>
            <button
              type="button"
              className={`severity-btn severe ${severity === 'severe' ? 'active' : ''}`}
              onClick={() => setSeverity('severe')}
            >
              Nặng
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">Gửi Báo Cáo</button>
      </form>
    </div>
  );
};

export default VaccinationReactionForm;