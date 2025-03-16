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
import paymentService from '../../service/paymentService';


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
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loadingAppointmentId, setLoadingAppointmentId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const sessionData = await sessionService.checkSession();
        if (sessionData) {
          const profileData = await customerService.getCustomerProfile(sessionData.body.cusId);
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
          const childrenData = await customerService.getCustomerChildren(sessionData.body.cusId);
          setChildren(childrenData);

          // Fetch appointments
          setLoadingAppointments(true);
          const appointmentsData = await appointmentService.getAppointmentsByCustomerId(sessionData.body.cusId);
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

  const handleOpenCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
    setCancelReason(""); // Reset lý do mỗi lần mở modal
  };

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel || !cancelReason) return;
    
    try {
      // Show loading state
      setLoadingAppointmentId(appointmentToCancel.appId);
      
      // Call API to update status to CANCELLED
      const updatedAppointment = await appointmentService.updateAppointmentStatus(
        appointmentToCancel.appId, 
        'CANCELLED'
      );
      
      // Update the local state with the cancelled appointment
      setAppointments(appointments.map(app => 
        app.appId === appointmentToCancel.appId ? {...app, status: 'CANCELLED'} : app
      ));
      
      // Đóng modal và hiển thị thông báo
      setShowCancelModal(false);
      alert('Đã hủy cuộc hẹn thành công');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Không thể hủy cuộc hẹn. Vui lòng thử lại sau.');
    } finally {
      setLoadingAppointmentId(null);
    }
  };

  const handlePayment = async (appointment) => {
    try {
      setProcessingPayment(true);
      
      // Get payment URL from API
      const paymentUrl = await paymentService.createPayment(appointment.appId);
      console.log('Payment URL:', paymentUrl);
      
      // Save appointment ID to localStorage to check status after return
      localStorage.setItem('pendingPaymentAppId', appointment.appId);
      
      // Open VNPay payment page in a new tab instead of redirecting
      const newTab = window.open(paymentUrl, '_blank');
      
      // Check if popup was blocked
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        alert('Trình duyệt đã chặn cửa sổ thanh toán. Vui lòng cho phép popup và thử lại.');
      }
      
      // Reset processing state after a short delay
      setTimeout(() => {
        setProcessingPayment(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Không thể khởi tạo thanh toán. Vui lòng thử lại sau.');
      setProcessingPayment(false);
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
              <div className="filter-section">
                <h4>Lọc theo trạng thái:</h4>
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('ALL')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`filter-btn ${statusFilter === 'CONFIRMED' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('CONFIRMED')}
                  >
                    Đã xác nhận
                  </button>
                  <button 
                    className={`filter-btn ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('COMPLETED')}
                  >
                    Đã hoàn thành
                  </button>
                  <button 
                    className={`filter-btn ${statusFilter === 'CANCELLED' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('CANCELLED')}
                  >
                    Đã hủy
                  </button>
                </div>
              </div>
              {loadingAppointments ? (
                <div className="loading">Đang tải lịch sử tiêm chủng...</div>
              ) : appointments.length > 0 ? (
                <>
                  {/* Lọc và hiển thị appointments theo statusFilter */}
                  {appointments
                    .filter(appointment => statusFilter === 'ALL' || appointment.status === statusFilter)
                    // Sắp xếp theo số trong mã ID "APPxxx" từ cao đến thấp
                    .sort((a, b) => {
                      // Trích xuất phần số từ ID có định dạng "APPxxx"
                      const numA = parseInt(a.appId.substring(3), 10) || 0;
                      const numB = parseInt(b.appId.substring(3), 10) || 0;
                      // Sắp xếp giảm dần (mới nhất trên cùng)
                      return numB - numA;
                    })                  
                    .map((appointment) => (
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
                          {/* Nội dung history-info giữ nguyên */}
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
                          {appointment.status === 'COMPLETED' && appointment.paymentStatus !== 'PAID' && (
                            <div className="info-row payment">
                              <button 
                                className="payment-btn"
                                onClick={() => handlePayment(appointment)}
                                disabled={processingPayment}
                              >
                                {processingPayment ? 'Đang xử lý...' : 'Thanh toán'}
                              </button>
                            </div>
                          )}
                          {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                            <div className="info-row cancel">
                              <button 
                                className="cancel-appointment-btn"
                                onClick={() => handleOpenCancelModal(appointment)}
                                disabled={loadingAppointmentId === appointment.appId}
                              >
                                {loadingAppointmentId === appointment.appId ? 'Đang xử lý...' : 'Hủy lịch hẹn'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  
                  {/* Thông báo khi không có kết quả sau khi lọc */}
                  {appointments.filter(app => statusFilter === 'ALL' || app.status === statusFilter).length === 0 && (
                    <div className="no-filtered-results">
                      <p>Không có lịch hẹn nào khớp với bộ lọc đã chọn.</p>
                    </div>
                  )}
                </>
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
      {showCancelModal && appointmentToCancel && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <div className="modal-header">
              <h3>Hủy lịch hẹn</h3>
              <button className="close-btn" onClick={() => setShowCancelModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="appointment-info">
                <p><strong>Mã cuộc hẹn:</strong> {appointmentToCancel.appId}</p>
                <p><strong>Trẻ:</strong> {appointmentToCancel.child?.fullName}</p>
                <p><strong>Ngày hẹn:</strong> {new Date(appointmentToCancel.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Dịch vụ:</strong> {appointmentToCancel.vaccineId?.name || appointmentToCancel.packageId?.name || "N/A"}</p>
              </div>
              <div className="reason-section">
                <p>Vui lòng chọn lý do hủy lịch hẹn:</p>
                <div className="reason-options">
                  <div className="reason-option">
                    <input 
                      type="radio" 
                      id="reschedule" 
                      name="cancelReason" 
                      value="Mong muốn dời lịch" 
                      checked={cancelReason === "Mong muốn dời lịch"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="reschedule">Mong muốn dời lịch</label>
                  </div>
                  <div className="reason-option">
                    <input 
                      type="radio" 
                      id="wrongService" 
                      name="cancelReason" 
                      value="Đặt nhầm dịch vụ" 
                      checked={cancelReason === "Đặt nhầm dịch vụ"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="wrongService">Đặt nhầm dịch vụ</label>
                  </div>
                  <div className="reason-option">
                    <input 
                      type="radio" 
                      id="wrongChild" 
                      name="cancelReason" 
                      value="Chọn nhầm trẻ đi tiêm" 
                      checked={cancelReason === "Chọn nhầm trẻ đi tiêm"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="wrongChild">Chọn nhầm trẻ đi tiêm</label>
                  </div>
                  <div className="reason-option">
                    <input 
                      type="radio" 
                      id="other" 
                      name="cancelReason" 
                      value="Khác" 
                      checked={cancelReason === "Khác"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="other">Khác</label>
                  </div>
                  {cancelReason === "Khác" && (
                    <textarea
                      className="other-reason"
                      placeholder="Vui lòng nhập lý do hủy lịch hẹn..."
                      rows="3"
                      onChange={(e) => setCancelReason(`Khác: ${e.target.value}`)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCancelModal(false)}
              >
                Đóng
              </button>
              <button 
                className="confirm-btn"
                onClick={handleCancelAppointment}
                disabled={!cancelReason || loadingAppointmentId === appointmentToCancel.appId}
              >
                {loadingAppointmentId === appointmentToCancel.appId ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;