import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaHome } from 'react-icons/fa';
import '../../styles/CusStyles/PaymentResult.css';
import appointmentService from '../../service/appointmentService';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if success or failure based on URL path
  const isSuccess = location.pathname.includes('/success');
  
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        // Get the appointment ID from localStorage (set before redirecting to VNPay)
        const appointmentId = localStorage.getItem('pendingPaymentAppId');
        
        if (appointmentId) {
          const appointment = await appointmentService.getAppointmentById(appointmentId);
          setAppointmentDetails(appointment);
          
          // Clear the pending payment ID
          localStorage.removeItem('pendingPaymentAppId');
        }
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointmentDetails();
  }, []);
  
  // const handleBackToProfile = () => {
  //   navigate('/profile');
  // };
  
  // const handleBackHome = () => {
  //   navigate('/');
  // };
  
  if (loading) {
    return <div className="payment-result loading">Đang tải thông tin...</div>;
  }
  
  return (
    <div className="payment-result-container">
      {/* <div className="profile-header">
        <button onClick={handleBackHome} className="back-home-btn">
          <FaHome /> Quay lại trang chủ
        </button>
      </div> */}
      
      <div className={`payment-result ${isSuccess ? 'success' : 'error'}`}>
        {isSuccess ? (
          <>
            <FaCheckCircle className="result-icon success" />
            <h2>Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã thanh toán cho cuộc hẹn tiêm chủng.</p>
          </>
        ) : (
          <>
            <FaTimesCircle className="result-icon error" />
            <h2>Thanh toán không thành công</h2>
            <p>Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.</p>
          </>
        )}
        
        {appointmentDetails && (
          <div className="appointment-details">
            <h3>Thông tin cuộc hẹn</h3>
            <div className="detail-item">
              <span>Mã cuộc hẹn:</span>
              <span>{appointmentDetails.appId}</span>
            </div>
            <div className="detail-item">
              <span>Tên trẻ:</span>
              <span>{appointmentDetails.child?.fullName}</span>
            </div>
            <div className="detail-item">
              <span>Ngày hẹn:</span>
              <span>{new Date(appointmentDetails.appointmentDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span>Trạng thái:</span>
              <span className={isSuccess ? 'status-paid' : 'status-pending'}>
                {isSuccess ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
          </div>
        )}
{/*         
        <button className="back-btn" onClick={handleBackToProfile}>
          <FaArrowLeft /> Quay lại hồ sơ
        </button> */}
      </div>
    </div>
  );
};

export default PaymentResult;