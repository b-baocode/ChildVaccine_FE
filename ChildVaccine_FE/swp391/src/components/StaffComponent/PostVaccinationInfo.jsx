import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaClock, FaUserInjured, FaNotesMedical } from 'react-icons/fa';
import '../../styles/StaffStyles/PostVaccinationInfo.css';
import reactionService from '../../service/reactionService';

const PostVaccineInfo = () => {
  const [reactions, setReactions] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);
        const data = await reactionService.getAllReactions();
        setReactions(data);
      } catch (err) {
        console.error('Error fetching reactions:', err);
        setError('Không thể tải dữ liệu phản ứng sau tiêm');
      } finally {
        setLoading(false);
      }
    };

    fetchReactions();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'MILD':
        return 'severity-mild';
      case 'SEVERE':
        return 'severity-severe';
      case 'EMERGENCY':
        return 'severity-emergency';
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

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error-message">{error}</div>;

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
            <option value="SEVERE">Trung bình</option>
            <option value="EMERGENCY">Nặng</option>
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
                {reaction.severity === 'SEVERE' && 'Trung bình'}
                {reaction.severity === 'EMERGENCY' && 'Nặng'}
              </div>
              <div className="datetime">
                <FaClock />
                {formatDateTime(reaction.reactionDate)}
              </div>
            </div>

            <div className="patient-info">
              <h3>{reaction.childName}</h3>
              <span className="appointment-id">Mã tiêm: {reaction.appointmentId}</span>
              <span className="child-id">Mã trẻ: {reaction.childId}</span>
            </div>

            <div className="reaction-details">
              <div className="symptoms">
                <div className="detail-header">
                  <FaUserInjured />
                  <h4>Triệu chứng:</h4>
                </div>
                <p>{reaction.symptoms}</p>
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