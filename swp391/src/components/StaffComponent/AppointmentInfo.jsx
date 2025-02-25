import React, { useEffect, useState } from 'react';
import appointmentService from '../../service/appointmentService'; // Điều chỉnh đường dẫn nếu cần
import '../../styles/StaffStyles/Appointments.css';

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

  const handleOverlayClick = (event) => {
    if (event.target.className === 'update-modal-overlay') {
      handleCloseModal();
    }
  };

  const handleUpdateClick = (appointment) => {
    setSelectedAppointmentId(appointment.appId);
    setSymptoms(appointment.symptoms || '');
    setNotes('');
    setStatus(appointment.status);
    setShowUpdateModal(true);
  };

  const handleSaveClick = (appointmentId) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.appId === appointmentId
        ? { ...appointment, status, symptoms, notes: '' }
        : appointment
    );
    setAppointments(updatedAppointments);
    setShowUpdateModal(false);
    setSelectedAppointmentId(null);
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
    const { appointmentId, newStatus } = pendingStatusChange;
    try {
        const updatedAppointment = await appointmentService.updateAppointmentStatus(
            appointmentId,
            newStatus.toUpperCase()
        );
        const updatedAppointments = appointments.map((appointment) =>
            appointment.appId === appointmentId ? updatedAppointment : appointment
        );
        setAppointments(updatedAppointments);
        setShowConfirmModal(false);

        // Nếu status là COMPLETED, emit event qua socket (nếu có)
        if (newStatus.toUpperCase() === 'COMPLETED') {
            // Nếu bạn có socket, có thể emit event ở đây
            console.log('🔔 Appointment completed, feedback required:', appointmentId);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.appId}>
              <td>{appointment.appId}</td>
              <td>{appointment.customerId?.cusId || "N/A"}</td>
              <td>{appointment.childId?.childId || "N/A"}</td>
              <td>{getServiceId(appointment)}</td>
              <td>{appointment.appointmentDate}</td>
              <td>{appointment.appointmentTime}</td>
              <td>
                <select
                  value={appointment.status}
                  onChange={(e) => handleStatusChange(appointment.appId, e.target.value)}
                  className="status-select"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
              <td>{appointment.paymentStatus}</td>
              <td>{appointment.notes || ''}</td>
              <td>
                <button onClick={() => handleUpdateClick(appointment)}>Update</button>
              </td>
            </tr>
          ))}
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
      {showUpdateModal && (
        <div className="update-modal-overlay" onClick={handleOverlayClick}>
          <div className="update-modal">
            <div className="update-modal-header">
              <h2 className="update-modal-title">Cập nhật thông tin</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-info">
              <div className="info-item">
                <span className="info-label">ID lịch tiêm:</span>
                <span className="info-value">{selectedAppointmentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Staff ID:</span>
                <span className="info-value">ST001</span>
              </div>
            </div>
            <div className="update-form">
              <div className="form-group">
                <label>Triệu chứng</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Nhập triệu chứng"
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={() => handleSaveClick(selectedAppointmentId)}>
                Lưu
              </button>
              <button className="cancel-button" onClick={handleCloseModal}>
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAppointment;  