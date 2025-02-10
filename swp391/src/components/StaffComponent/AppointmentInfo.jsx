import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/StaffStyles/Appointments.css';

const StaffAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments data from the API
    axios.get('/api/appointments')
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the appointments!', error);
      });
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{appointment.customer_id}</td>
              <td>{appointment.child_id}</td>
              <td>{appointment.vaccine_id}</td>
              <td>{appointment.appointment_date}</td>
              <td>{appointment.appointment_time}</td>
              <td>{appointment.status}</td>
              <td>{appointment.payment_status}</td>
              <td>{appointment.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffAppointment;