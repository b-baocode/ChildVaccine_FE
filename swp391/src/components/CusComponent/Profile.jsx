import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaIdCard, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaHome,
  FaCalendar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/CusStyles/Profile.css';
import customerService from '../../service/customerService';
import sessionService from '../../service/sessionService';
import appointmentService from '../../service/appointmentService';
import { FaStar } from 'react-icons/fa';
import feedbackService from '../../service/feedbackService';


const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('children');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [children, setChildren] = useState([]);

  const [editedInfo, setEditedInfo] = useState({
    phone: '',
    address: ''
  });

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const sessionData = await sessionService.checkSession();
        if (sessionData) {
          const profileData = await customerService.getCustomerProfile(sessionData.cusId);
          setUserInfo({
            name: profileData.fullName,
            id: profileData.cusId,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            gender: profileData.gender,
            dateOfBirth: new Date(profileData.dateOfBirth).toLocaleDateString()
          });

          // Fetch children data
          const childrenData = await customerService.getCustomerChildren(sessionData.cusId);
          setChildren(childrenData);

          // Fetch appointments
          setLoadingAppointments(true);
          const appointmentsData = await appointmentService.getAppointmentsByCustomerId(sessionData.cusId);
          setAppointments(appointmentsData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
        setLoadingAppointments(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleFeedback = (appointment) => {
    if (appointment.hasFeedback) {
      alert('Buổi tiêm này đã được đánh giá.');
      return;
    }
    setSelectedAppointment(appointment);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      setSubmitting(true);
      
      const feedbackData = {
        appointmentId: selectedAppointment.appId,
        rating: rating,
        feedback: comment.trim()
      };
  
      await feedbackService.submitFeedback(feedbackData);
      
      // Update the appointments list to reflect the feedback status
      setAppointments(appointments.map(app => 
        app.appId === selectedAppointment.appId 
          ? { ...app, hasFeedback: true }
          : app
      ));
      
      alert('Cảm ơn bạn đã đánh giá!');
      
      setShowFeedbackModal(false);
      setSelectedAppointment(null);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
    setSelectedAppointment(null);
    setRating(0);
    setComment('');
  };

  // Update handlers to use real data
  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({
      phone: userInfo?.phone || '',
      address: userInfo?.address || ''
    });
  };

  const handleSave = async () => {
    try {
      // Add API call to update customer info here
      setUserInfo(prev => ({
        ...prev,
        phone: editedInfo.phone,
        address: editedInfo.address
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Không thể cập nhật thông tin');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddChild = () => {
    navigate('/add-child');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  if (loading) return <div className="loading">Đang tải thông tin...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!userInfo) return <div className="error-message">Không tìm thấy thông tin người dùng</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={handleBackHome} className="back-home-btn">
          <FaHome /> Quay lại trang chủ
        </button>
      </div>

      {/* Left Section - User Info */}
      <div className="profile-sidebar">
        <div className="user-avatar">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="User Avatar" />
        </div>
        
        <div className="user-info">
          <div className="info-item name">
            <h2>{userInfo.name}</h2>
          </div>
          <div className="info-item">
            <FaIdCard className="info-icon" />
            <span>{userInfo.id}</span>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <span>{userInfo.email}</span>
          </div>
          
          {isEditing ? (
            <div className="edit-form">
              <div className="edit-item">
                <FaPhone className="info-icon" />
                <input
                  type="text"
                  value={editedInfo.phone}
                  onChange={(e) => setEditedInfo({...editedInfo, phone: e.target.value})}
                  placeholder="Số điện thoại"
                />
              </div>
              <div className="edit-item">
                <FaMapMarkerAlt className="info-icon" />
                <input
                  type="text"
                  value={editedInfo.address}
                  onChange={(e) => setEditedInfo({...editedInfo, address: e.target.value})}
                  placeholder="Địa chỉ"
                />
              </div>
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-btn">
                  <FaSave /> Lưu
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  <FaTimes /> Hủy
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{userInfo.phone}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <span>{userInfo.address}</span>
              </div>
              <button onClick={handleEdit} className="edit-btn">
                <FaEdit /> Cập nhật hồ sơ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Section - Content */}
      <div className="profile-content">
        <div className="content-header">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'children' ? 'active' : ''}`}
              onClick={() => setActiveTab('children')}
            >
              Hồ sơ trẻ
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Lịch sử tiêm chủng
            </button>
          </div>
        </div>

        {activeTab === 'children' ? (
            <>
              <div className="add-child-section">
                <button className="add-child-btn" onClick={handleAddChild}>
                  <FaPlus /> Thêm hồ sơ trẻ
                </button>
              </div>
              <div className="children-list">
                {children.length > 0 ? children.map(child => (
                  <div key={child.childId} className="child-card">
                    <div className="child-header">
                      <h3>{child.fullName}</h3>
                      <span className="child-id">ID: {child.childId}</span>
                    </div>
                    <div className="child-info">
                      <div className="info-row">
                        <span>Ngày sinh: {new Date(child.dateOfBirth).toLocaleDateString()}</span>
                        <span>Giới tính: {child.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                      </div>
                      <div className="info-row">
                        <span>Chiều cao: {child.height} cm</span>
                        <span>Cân nặng: {child.weight} kg</span>
                      </div>
                      <div className="info-row">
                        <span>Nhóm máu: {child.bloodType || 'Chưa có thông tin'}</span>
                      </div>
                      <div className="info-row">
                        <span>Dị ứng: {child.allergies || 'Không có'}</span>
                      </div>
                      <div className="info-row">
                        <span>Ghi chú: {child.healthNote || 'Không có'}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="no-children">
                    <p>Chưa có hồ sơ trẻ nào. Hãy thêm hồ sơ trẻ đầu tiên của bạn!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="vaccine-history">
              {loadingAppointments ? (
                <div className="loading">Đang tải lịch sử tiêm chủng...</div>
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.appId} className="history-card">
                    <div className="history-header">
                    <h3>{appointment.child?.fullName || 'Không có tên'}</h3>
                      <span className={`status ${appointment.status.toLowerCase()}`}>
                        {appointment.status === 'PENDING' && 'Chờ xác nhận'}
                        {appointment.status === 'CONFIRMED' && 'Đã xác nhận'}
                        {appointment.status === 'COMPLETED' && 'Đã hoàn thành'}
                        {appointment.status === 'CANCELLED' && 'Đã hủy'}
                      </span>
                    </div>
                    <div className="history-info">
                      <div className="info-row">
                        <span><FaIdCard className="info-icon" /> Mã cuộc hẹn: {appointment.appId}</span>
                        <span><FaCalendar className="info-icon" /> Ngày: {new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="info-row">
                        <span>Thời gian: {appointment.appointmentTime}</span>
                        <span>Thanh toán: {appointment.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                      </div>
                      {appointment.notes && (
                        <div className="info-row notes">
                          <span>Ghi chú: {appointment.notes}</span>
                        </div>
                      )}
                      {appointment.status === 'COMPLETED' && !appointment.hasFeedback && (
                        <div className="info-row feedback">
                          <button 
                            className="feedback-btn"
                            onClick={() => handleFeedback(appointment)}
                          >
                            Đánh giá
                          </button>
                        </div>
                      )}
                      {appointment.status === 'COMPLETED' && appointment.hasFeedback && (
                        <div className="info-row feedback-submitted">
                          <span className="feedback-submitted-text">
                            <FaStar className="info-icon" style={{ color: '#ffc107' }} /> Đã đánh giá
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-history">
                  <p>Chưa có lịch sử tiêm chủng nào.</p>
                </div>
              )}
            </div>
          )}
      </div>

      {showFeedbackModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <div className="modal-header">
              <h3>Đánh giá buổi tiêm chủng</h3>
              <button className="close-btn" onClick={handleCloseFeedback}>×</button>
            </div>
            <div className="modal-content">
              <div className="appointment-info">
                <p><strong>Mã cuộc hẹn:</strong> {selectedAppointment.appId}</p>
                <p><strong>Trẻ:</strong> {selectedAppointment.child?.fullName}</p>
                <p><strong>Ngày tiêm:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Vắc-xin:</strong> {selectedAppointment.vaccineId?.name}</p>
              </div>
              <div className="rating-section">
                <p>Đánh giá của bạn:</p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= rating ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="comment-section">
                <p>Nhận xét của bạn:</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập nhận xét của bạn..."
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={handleCloseFeedback}
                disabled={submitting}
              >
                Hủy
              </button>
              <button 
                className="submit-btn"
                onClick={handleSubmitFeedback}
                disabled={submitting || rating === 0}
              >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;