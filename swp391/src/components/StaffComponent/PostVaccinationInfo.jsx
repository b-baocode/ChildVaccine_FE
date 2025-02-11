import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaClock, FaUserInjured, FaNotesMedical } from 'react-icons/fa';
import '../../styles/StaffStyles/PostVaccinationInfo.css';

const PostVaccineInfo = () => {
  const [reactions, setReactions] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Mock data cho phản ứng sau tiêm
  const reactionData = [
    {
      id: 1,
      child_id: 1,
      child_name: "Nguyễn Minh Anh",
      appointment_id: "APT001",
      vaccine_name: "MMR",
      symptoms: "Sốt nhẹ 38°C, đau tại chỗ tiêm",
      severity: "MILD",
      reaction_date: "2024-03-15T14:30:00",
      notes: "Theo dõi 30 phút sau tiêm, cho về sau khi ổn định"
    },
    {
      id: 2,
      child_id: 2,
      child_name: "Trần Đức Minh",
      appointment_id: "APT002",
      vaccine_name: "DPT",
      symptoms: "Sốt cao 39°C, quấy khóc nhiều",
      severity: "MODERATE",
      reaction_date: "2024-03-15T10:15:00",
      notes: "Kê đơn thuốc hạ sốt, tái khám nếu sốt kéo dài"
    },
    {
      id: 3,
      child_id: 3,
      child_name: "Lê Thu Hà",
      appointment_id: "APT003",
      vaccine_name: "Viêm gan B",
      symptoms: "Phản ứng dị ứng, khó thở",
      severity: "SEVERE",
      reaction_date: "2024-03-14T09:45:00",
      notes: "Chuyển khoa cấp cứu để theo dõi và điều trị"
    }
  ];

  useEffect(() => {
    setReactions(reactionData);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'MILD':
        return 'severity-mild';
      case 'MODERATE':
        return 'severity-moderate';
      case 'SEVERE':
        return 'severity-severe';
      default:
        return '';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReactions = selectedSeverity === 'all' 
    ? reactions 
    : reactions.filter(reaction => reaction.severity === selectedSeverity);

  return (
    <div className="post-vaccine-container">
      <div className="page-header">
        <h1>Theo Dõi Phản Ứng Sau Tiêm</h1>
        <div className="severity-filter">
          <label>Lọc theo mức độ:</label>
          <select 
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="MILD">Nhẹ</option>
            <option value="MODERATE">Trung bình</option>
            <option value="SEVERE">Nặng</option>
          </select>
        </div>
      </div>

      <div className="reactions-grid">
        {filteredReactions.map((reaction) => (
          <div key={reaction.id} className={`reaction-card ${getSeverityColor(reaction.severity)}`}>
            <div className="card-header">
              <div className="severity-badge">
                <FaExclamationTriangle />
                {reaction.severity === 'MILD' && 'Nhẹ'}
                {reaction.severity === 'MODERATE' && 'Trung bình'}
                {reaction.severity === 'SEVERE' && 'Nặng'}
              </div>
              <div className="datetime">
                <FaClock />
                {formatDateTime(reaction.reaction_date)}
              </div>
            </div>

            <div className="patient-info">
              <h3>{reaction.child_name}</h3>
              <span className="appointment-id">Mã tiêm: {reaction.appointment_id}</span>
              <span className="vaccine-name">Vaccine: {reaction.vaccine_name}</span>
            </div>

            <div className="reaction-details">
              <div className="symptoms">
                <div className="detail-header">
                  <FaUserInjured />
                  <h4>Triệu chứng:</h4>
                </div>
                <p>{reaction.symptoms}</p>
              </div>

              <div className="notes">
                <div className="detail-header">
                  <FaNotesMedical />
                  <h4>Ghi chú:</h4>
                </div>
                <p>{reaction.notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReactions.length === 0 && (
        <div className="no-reactions">
          <p>Không có phản ứng nào được ghi nhận</p>
        </div>
      )}
    </div>
  );
};

export default PostVaccineInfo;