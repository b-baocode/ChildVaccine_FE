import React, { useEffect, useState } from 'react';
import appointmentService from '../../service/appointmentService'; // Điều chỉnh đường dẫn nếu cần
import '../../styles/StaffStyles/Appointments.css';
import recordService from '../../service/recordService';
import paymentService from '../../service/paymentService'; // Import paymentService


const StaffAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('CONFIRMED');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false); // Thêm state cho warningModal
  const [warningMessage, setWarningMessage] = useState(''); // Lưu thông báo lỗi
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  const [records, setRecords] = useState([]);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsData = await appointmentService.getAllAppointments();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showUpdateModal) {
        handleCloseModal();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showUpdateModal]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsData = await recordService.getAllRecords();
        setRecords(recordsData);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
  
    fetchRecords();
  }, []);
  
  const hasRecord = (appointmentId) => {
    return records.some(record => record.appointmentId === appointmentId);
  };

  const getRecordForAppointment = (appointmentId) => {
    return records.find(record => record.appointmentId === appointmentId) || {};
  };

  const handleOverlayClick = (event) => {
    if (event.target.className === 'update-modal-overlay') {
      handleCloseModal();
    }
  };

  const handleUpdateClick = (appointment) => {
    setSelectedAppointmentId(appointment.appId);
    
    const record = getRecordForAppointment(appointment.appId);
    
    if (record.id) {
      // Record exists - set values from record and mark as view-only
      setSymptoms(record.symptoms || '');
      setNotes(record.notes || '');
      setIsViewOnly(true); // New state variable
    } else {
      // No record - allow creation
      setSymptoms('');
      setNotes('');
      setIsViewOnly(false);
    }
    
    setStatus(appointment.status);
    setShowUpdateModal(true);
  };

 
  const handleSaveClick = async (appointmentId) => {
    try {
        // Create record data
        const recordData = {
            appointmentId: appointmentId,
            staffId: 'S001', // Replace with actual staff ID from session/context
            symptoms: symptoms,
            notes: notes,
            appointmentDate: new Date().toISOString().split('T')[0]
        };

        // Save record
        await recordService.createRecord(recordData);

        // Update local state
        const updatedAppointments = appointments.map((appointment) =>
            appointment.appId === appointmentId
                ? { ...appointment, symptoms, notes }
                : appointment
        );
        setAppointments(updatedAppointments);

        // Show success message
        alert('Cập nhật thông tin thành công!');

        // Close modal and reset form
        setShowUpdateModal(false);
        setSelectedAppointmentId(null);
        setSymptoms('');
        setNotes('');
    } catch (error) {
        console.error('Error saving record:', error);
        alert(error.message || 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!');
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    const currentAppointment = appointments.find((appt) => appt.appId === appointmentId);
    const currentStatus = currentAppointment.status;

    // Kiểm tra logic trước khi hiển thị modal
    if (currentStatus === 'CANCELLED' && newStatus !== 'CANCELLED') {
      setWarningMessage('Không thể thay đổi trạng thái từ CANCELLED sang trạng thái khác.');
      setShowWarningModal(true);
    } else if (currentStatus === 'COMPLETED' && newStatus === 'CONFIRMED') {
      setWarningMessage('Không thể thay đổi trạng thái từ COMPLETED về CONFIRMED.');
      setShowWarningModal(true);
    } else {
      setPendingStatusChange({ appointmentId, newStatus });
      setShowConfirmModal(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { appointmentId, newStatus } = pendingStatusChange;

    try {
        const updatedAppointment = await appointmentService.updateAppointmentStatus(
            appointmentId,
            newStatus.toUpperCase()
        );

        setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.appId === appointmentId ? updatedAppointment : appointment
            )
        );

        setShowConfirmModal(false);
        setPendingStatusChange(null);

        // Hiển thị thông báo cập nhật thành công
        alert(`Trạng thái đã được cập nhật thành ${newStatus.toUpperCase()}!`);

        // Nếu status là COMPLETED, có thể phát sự kiện qua WebSocket (nếu cần)
        if (newStatus.toUpperCase() === 'COMPLETED') {
            console.log('🔔 Appointment completed, feedback required:', appointmentId);
            // Gửi event socket ở đây nếu hệ thống hỗ trợ
        }

    } catch (error) {
        console.error('Error updating appointment status:', error);
        alert(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại!');
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedAppointmentId(null);
    setSymptoms('');
    setNotes('');
    setStatus('CONFIRMED');
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
    setWarningMessage('');
  };

  const getServiceId = (appointment) => {
    if (appointment.vaccineId && typeof appointment.vaccineId === 'object') {
      return appointment.vaccineId.vaccineId;
    }
    if (appointment.packageId && typeof appointment.packageId === 'object') {
      return appointment.packageId.packageId;
    }
    return "N/A";
  };
    // Add this function after the other handler functions
  const handlePayment = async (appointment) => {
    try {
      setProcessingPayment(true);
      setProcessingPaymentId(appointment.appId);
      
      // Import paymentService at the top of the file
      // import paymentService from '../../service/paymentService';
      
      // Get payment URL from API
      const paymentUrl = await paymentService.createPayment(appointment.appId);
      
      // Open VNPay payment page in a new tab
      const newTab = window.open(paymentUrl, '_blank');
      
      // Check if popup was blocked
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        alert('Trình duyệt đã chặn cửa sổ thanh toán. Vui lòng cho phép popup và thử lại.');
      }
      
      // Reset processing state after a short delay
      setTimeout(() => {
        setProcessingPayment(false);
        setProcessingPaymentId(null);
      }, 1000);
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Không thể khởi tạo thanh toán. Vui lòng thử lại sau.');
      setProcessingPayment(false);
      setProcessingPaymentId(null);
    }
  };

  return (
    <div className="appointment-page">
      <h1>Appointments</h1>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Child ID</th>
            <th>Service ID</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Notes</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const appointmentRecord = getRecordForAppointment(appointment.appId);
            const hasExistingRecord = Boolean(appointmentRecord.id);
            
            return (
              <tr key={appointment.appId}>
                <td>{appointment.appId}</td>
                <td>{appointment.customer?.cusId || "N/A"}</td>
                <td>{appointment.child?.childId || "N/A"}</td>
                <td>{appointment.vaccineId?.name || appointment.packageId?.name || "N/A"}</td>
                <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td>{appointment.appointmentTime}</td>
                <td>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.appId, e.target.value)}
                    className={`status-select ${appointment.status.toLowerCase()}`}
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className={`payment-status ${appointment.paymentStatus.toLowerCase()}`}>
                  {appointment.paymentStatus}
                </td>
                <td>{hasExistingRecord ? appointmentRecord.notes : (appointment.notes || '')}</td>
                <td>
                  <button 
                    className={hasExistingRecord ? "view-btn" : "update-btn"}
                    onClick={() => handleUpdateClick(appointment)}
                  >
                    {hasExistingRecord ? "View" : "Update"}
                  </button>
                </td>
                <td>
                  {appointment.status === 'COMPLETED' && appointment.paymentStatus !== 'PAID' && (
                    <button 
                      className="payment-btn"
                      onClick={() => handlePayment(appointment)}
                      disabled={processingPayment && processingPaymentId === appointment.appId}
                    >
                      {processingPayment && processingPaymentId === appointment.appId ? 'Đang xử lý...' : 'Thanh toán'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác nhận thay đổi</h2>
            <p>Bạn có chắc chắn muốn thay đổi trạng thái thành {pendingStatusChange?.newStatus}?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={confirmStatusChange}>
                Xác nhận
              </button>
              <button className="cancel-button" onClick={() => setShowConfirmModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cảnh báo</h2>
            <p>{warningMessage}</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCloseWarningModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {/* Update Modal */}
      {showUpdateModal && (
        <div className="update-modal-overlay" onClick={handleOverlayClick}>
          <div className="update-modal">
            <div className="update-modal-header">
              <h2 className="update-modal-title">
                {isViewOnly ? "Xem thông tin" : "Cập nhật thông tin"}
              </h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-info">
              <div className="info-item">
                <span className="info-label">ID lịch tiêm:</span>
                <span className="info-value">{selectedAppointmentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Staff ID:</span>
                <span className="info-value">
                  {isViewOnly 
                    ? (getRecordForAppointment(selectedAppointmentId).staffName || "N/A") 
                    : "ST001"}
                </span>
              </div>
              {isViewOnly && (
                <div className="info-item">
                  <span className="info-label">Ngày ghi nhận:</span>
                  <span className="info-value">
                    {getRecordForAppointment(selectedAppointmentId).appointmentDate || "N/A"}
                  </span>
                </div>
              )}
            </div>
            <div className="update-form">
              <div className="form-group">
                <label>Triệu chứng</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => !isViewOnly && setSymptoms(e.target.value)}
                  placeholder="Nhập triệu chứng"
                  readOnly={isViewOnly}
                  className={isViewOnly ? "readonly" : ""}
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={notes}
                  onChange={(e) => !isViewOnly && setNotes(e.target.value)}
                  placeholder="Nhập ghi chú"
                  readOnly={isViewOnly}
                  className={isViewOnly ? "readonly" : ""}
                />
              </div>
            </div>
            <div className="modal-footer">
              {!isViewOnly ? (
                <>
                  <button className="save-button" onClick={() => handleSaveClick(selectedAppointmentId)}>
                    Lưu
                  </button>
                  <button className="cancel-button" onClick={handleCloseModal}>
                    Hủy bỏ
                  </button>
                </>
              ) : (
                <button className="close-button-full" onClick={handleCloseModal}>
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAppointment;  