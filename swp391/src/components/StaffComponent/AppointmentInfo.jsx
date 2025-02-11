import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/StaffStyles/Appointments.css';

const StaffAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('PENDING');

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

  const handleUpdateClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    setSymptoms(appointment.symptoms || '');
    setNotes(appointment.notes || '');
    setStatus(appointment.status);
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
                <td>{appointment.status}</td>
                <td>{appointment.payment_status}</td>
                <td>{appointment.notes}</td>
                <td>
                  <button onClick={() => handleUpdateClick(appointment)}>Update</button>
                </td>
              </tr>
              {selectedAppointmentId === appointment.id && (
                <tr>
                  <td colSpan="10">
                    <div className="update-section">
                      <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Symptoms</label>
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="Enter symptoms"
                        />
                      </div>
                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter notes"
                        />
                      </div>
                      <button type="button" onClick={() => handleSaveClick(appointment.id)}>
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffAppointment;