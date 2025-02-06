import React, { useState } from 'react';

const AppointmentInfo = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 'AP001',
      customerName: 'Nguyễn Văn A',
      date: '2024-03-15',
      time: '10:00 AM',
      vaccine: 'Covid-19',
      status: 'Đã xác nhận'
    },
    {
      id: 'AP002',
      customerName: 'Trần Thị B',
      date: '2024-03-16',
      time: '11:00 AM',
      vaccine: 'Viêm gan B',
      status: 'Chưa xác nhận'
    },
    // Thêm các lịch hẹn khác ở đây
  ]);

  return (
    <div className="appointment-info-page">
      <h1>Thông tin lịch hẹn</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Ngày</th>
            <th>Thời gian</th>
            <th>Vaccine</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{appointment.customerName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.vaccine}</td>
              <td>{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentInfo;