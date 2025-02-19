import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/StaffStyles/Appointments.css';

const StaffAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    // Mock data for appointments
    const mockAppointments = [
      {
        id: 1,
        customer_id: 101,
        child_id: 201,
        vaccine_id: 301,
        appointment_date: '2025-02-15',
        appointment_time: '10:00',
        status: 'PENDING',
        payment_status: 'PAID',
        notes: 'First dose',
      },
      {
        id: 2,
        customer_id: 102,
        child_id: 202,
        vaccine_id: 302,
        appointment_date: '2025-02-16',
        appointment_time: '11:00',
        status: 'CONFIRMED',
        payment_status: 'PAID',
        notes: 'Second dose',
      },
      {
        id: 3,
        customer_id: 103,
        child_id: 203,
        vaccine_id: 303,
        appointment_date: '2025-02-17',
        appointment_time: '09:00',
        status: 'COMPLETED',
        payment_status: 'PAID',
        notes: 'Booster shot',
      },
      {
        id: 4,
        customer_id: 104,
        child_id: 204,
        vaccine_id: 304,
        appointment_date: '2025-02-18',
        appointment_time: '14:00',
        status: 'CANCELLED',
        payment_status: 'REFUNDED',
        notes: 'Cancelled by customer',
      },
      {
        id: 5,
        customer_id: 105,
        child_id: 205,
        vaccine_id: 305,
        appointment_date: '2025-02-19',
        appointment_time: '13:00',
        status: 'PENDING',
        payment_status: 'PENDING',
        notes: 'First dose',
      },
      {
        id: 6,
        customer_id: 106,
        child_id: 206,
        vaccine_id: 306,
        appointment_date: '2025-02-20',
        appointment_time: '15:00',
        status: 'CONFIRMED',
        payment_status: 'PAID',
        notes: 'Second dose',
      },
      {
        id: 7,
        customer_id: 107,
        child_id: 207,
        vaccine_id: 307,
        appointment_date: '2025-02-21',
        appointment_time: '16:00',
        status: 'COMPLETED',
        payment_status: 'PAID',
        notes: 'Booster shot',
      },
      {
        id: 8,
        customer_id: 108,
        child_id: 208,
        vaccine_id: 308,
        appointment_date: '2025-02-22',
        appointment_time: '10:00',
        status: 'PENDING',
        payment_status: 'PAID',
        notes: 'First dose',
      },
      {
        id: 9,
        customer_id: 109,
        child_id: 209,
        vaccine_id: 309,
        appointment_date: '2025-02-23',
        appointment_time: '11:00',
        status: 'CONFIRMED',
        payment_status: 'PAID',
        notes: 'Second dose',
      },
      {
        id: 10,
        customer_id: 110,
        child_id: 210,
        vaccine_id: 310,
        appointment_date: '2025-02-24',
        appointment_time: '09:00',
        status: 'COMPLETED',
        payment_status: 'PAID',
        notes: 'Booster shot',
      },
      {
        id: 11,
        customer_id: 111,
        child_id: 211,
        vaccine_id: 311,
        appointment_date: '2025-02-25',
        appointment_time: '14:00',
        status: 'CANCELLED',
        payment_status: 'REFUNDED',
        notes: 'Cancelled by customer',
      },
      {
        id: 12,
        customer_id: 112,
        child_id: 212,
        vaccine_id: 312,
        appointment_date: '2025-02-26',
        appointment_time: '13:00',
        status: 'PENDING',
        payment_status: 'PENDING',
        notes: 'First dose',
      },
      {
        id: 13,
        customer_id: 113,
        child_id: 213,
        vaccine_id: 313,
        appointment_date: '2025-02-27',
        appointment_time: '14:00',
        status: 'PENDING',
        payment_status: 'PAID',
        notes: 'First dose',
      },
      {
        id: 14,
        customer_id: 114,
        child_id: 214,
        vaccine_id: 314,
        appointment_date: '2025-02-28',
        appointment_time: '15:00',
        status: 'CONFIRMED',
        payment_status: 'PAID',
        notes: 'Second dose',
      },
      {
        id: 15,
        customer_id: 115,
        child_id: 215,
        vaccine_id: 315,
        appointment_date: '2025-03-01',
        appointment_time: '16:00',
        status: 'COMPLETED',
        payment_status: 'PAID',
        notes: 'Booster shot',
      },
      {
        id: 16,
        customer_id: 116,
        child_id: 216,
        vaccine_id: 316,
        appointment_date: '2025-03-02',
        appointment_time: '10:00',
        status: 'PENDING',
        payment_status: 'PAID',
        notes: 'First dose',
      },
      {
        id: 17,
        customer_id: 117,
        child_id: 217,
        vaccine_id: 317,
        appointment_date: '2025-03-03',
        appointment_time: '11:00',
        status: 'CONFIRMED',
        payment_status: 'PAID',
        notes: 'Second dose',
      },
    ];
    setAppointments(mockAppointments);
  }, []);

  // Thêm useEffect để handle ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showUpdateModal) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showUpdateModal]);

  // Thêm hàm để handle click outside modal
  const handleOverlayClick = (event) => {
    if (event.target.className === 'update-modal-overlay') {
      handleCloseModal();
    }
  };

  const handleUpdateClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    setSymptoms(appointment.symptoms || '');
    setNotes(appointment.notes || '');
    setStatus(appointment.status);
    setShowUpdateModal(true);
  };

  const handleSaveClick = (appointmentId) => {
    // Update the appointment with the new status, symptoms, and notes
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId
        ? { ...appointment, status, symptoms, notes }
        : appointment
    );
    setAppointments(updatedAppointments);
    setSelectedAppointmentId(null);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    setPendingStatusChange({
      appointmentId,
      newStatus
    });
    setShowConfirmModal(true);
  };

  const confirmStatusChange = () => {
    const { appointmentId, newStatus } = pendingStatusChange;
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    );
    setAppointments(updatedAppointments);
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedAppointmentId(null);
    setSymptoms('');
    setNotes('');
    setStatus('PENDING');
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
            <th>Vaccine ID</th>
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
            <React.Fragment key={appointment.id}>
              <tr>
                <td>{appointment.id}</td>
                <td>{appointment.customer_id}</td>
                <td>{appointment.child_id}</td>
                <td>{appointment.vaccine_id}</td>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.appointment_time}</td>
                <td>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
                <td>{appointment.payment_status}</td>
                <td>{appointment.notes}</td>
                <td>
                  <button onClick={() => handleUpdateClick(appointment)}>Update</button>
                </td>
              </tr>
            </React.Fragment>
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
              <button 
                className="confirm-button"
                onClick={confirmStatusChange}
              >
                Xác nhận
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
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
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            
            {/* Thêm phần hiển thị IDs */}
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