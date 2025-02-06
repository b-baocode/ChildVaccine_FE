import React, { useState } from 'react';
import '../styles/VaccinationReactionForm.css';

const VaccinationReactionForm = () => {
  const [formData, setFormData] = useState({
    childId: '',
    vaccinationId: '',
    symptoms: '',
    severity: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Xử lý gửi dữ liệu ở đây
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <h1 className="title">THÔNG TIN PHẢN ỨNG SAU TIÊM</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="childId" className="label">Chọn hồ sơ trẻ:</label>
          <select
            id="childId"
            name="childId"
            value={formData.childId}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">-- Chọn hồ sơ trẻ --</option>
            <option value="1">Nguyễn Văn A</option>
            <option value="2">Trần Thị B</option>
            <option value="3">Lê Văn C</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="vaccinationId" className="label">Chọn buổi tiêm:</label>
          <select
            id="vaccinationId"
            name="vaccinationId"
            value={formData.vaccinationId}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">-- Chọn buổi tiêm --</option>
            <option value="1">Vaccine A - 01/01/2024</option>
            <option value="2">Vaccine B - 15/01/2024</option>
            <option value="3">Vaccine C - 30/01/2024</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="symptoms" className="label">Triệu chứng bất thường:</label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Mô tả các triệu chứng bất thường..."
            required
            className="textarea-input"
          />
        </div>

        <div className="form-group">
          <label className="label">Mức độ nghiêm trọng:</label>
          <div className="severity-container">
            <div className="severity-option">
              <input
                type="radio"
                id="mild"
                name="severity"
                value="mild"
                checked={formData.severity === 'mild'}
                onChange={handleChange}
                required
              />
              <label htmlFor="mild">Nhẹ</label>
            </div>

            <div className="severity-option">
              <input
                type="radio"
                id="moderate"
                name="severity"
                value="moderate"
                checked={formData.severity === 'moderate'}
                onChange={handleChange}
              />
              <label htmlFor="moderate">Trung bình</label>
            </div>

            <div className="severity-option">
              <input
                type="radio"
                id="severe"
                name="severity"
                value="severe"
                checked={formData.severity === 'severe'}
                onChange={handleChange}
              />
              <label htmlFor="severe">Nặng</label>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Gửi báo cáo
        </button>
      </form>
    </div>
  );
};

export default VaccinationReactionForm;