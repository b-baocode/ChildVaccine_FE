import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../styles/VaccinationHistory.css';

const VaccinationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vaccineStatus, setVaccineStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const [appointments] = useState([
    {
      id: 'APT001',
      patientName: 'Nguyễn Văn An',
      patientAge: 5,
      vaccine: 'Vaccine 5 trong 1',
      date: '2024-03-20',
      time: '09:00 AM',
      status: 'Chưa tiêm',
      paymentStatus: 'Đã thanh toán',
      price: '1,500,000 VNĐ'
    },
    {
      id: 'APT002',
      patientName: 'Trần Thị Bình',
      patientAge: 3,
      vaccine: 'Vaccine Rotavirus',
      date: '2024-03-19',
      time: '10:30 AM',
      status: 'Đã tiêm',
      paymentStatus: 'Đã thanh toán',
      price: '850,000 VNĐ'
    },
    {
      id: 'APT003',
      patientName: 'Lê Minh Cường',
      patientAge: 4,
      vaccine: 'Vaccine Viêm gan B',
      date: '2024-03-21',
      time: '02:00 PM',
      status: 'Đã hủy',
      paymentStatus: 'Chưa thanh toán',
      price: '750,000 VNĐ'
    },
    {
      id: 'APT004',
      patientName: 'Phạm Thị Dung',
      patientAge: 2,
      vaccine: 'Vaccine 6 trong 1',
      date: '2024-03-22',
      time: '11:00 AM',
      status: 'Chưa tiêm',
      paymentStatus: 'Đã thanh toán một phần',
      price: '1,800,000 VNĐ'
    },
    {
      id: 'APT005',
      patientName: 'Hoàng Văn Em',
      patientAge: 1,
      vaccine: 'Vaccine Pneumo',
      date: '2024-03-20',
      time: '03:30 PM',
      status: 'Đã tiêm',
      paymentStatus: 'Đã thanh toán',
      price: '1,200,000 VNĐ'
    }
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleVaccineStatusChange = (e) => {
    setVaccineStatus(e.target.value);
  };

  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const filteredAppointments = appointments.filter(appointment => {
    return (
      (appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       appointment.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (vaccineStatus === '' || appointment.status === vaccineStatus) &&
      (paymentStatus === '' || appointment.paymentStatus === paymentStatus)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã tiêm':
        return 'status-completed';
      case 'Chưa tiêm':
        return 'status-pending';
      case 'Đã hủy':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Đã thanh toán':
        return 'payment-completed';
      case 'Chưa thanh toán':
        return 'payment-pending';
      case 'Đã thanh toán một phần':
        return 'payment-partial';
      default:
        return '';
    }
  };

  return (
    <div className="vaccination-history">
      <div className="search-filters">
        <div className="search-field">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-field">
          <select value={vaccineStatus} onChange={handleVaccineStatusChange}>
            <option value="">Trạng thái tiêm chủng</option>
            <option value="Chưa tiêm">Chưa tiêm</option>
            <option value="Đã tiêm">Đã tiêm</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div className="filter-field">
          <select value={paymentStatus} onChange={handlePaymentStatusChange}>
            <option value="">Trạng thái thanh toán</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Chưa thanh toán">Chưa thanh toán</option>
            <option value="Đã thanh toán một phần">Đã thanh toán một phần</option>
          </select>
        </div>
      </div>

      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên bệnh nhân</th>
              <th>Tuổi</th>
              <th>Vaccine</th>
              <th>Ngày tiêm</th>
              <th>Giờ tiêm</th>
              <th>Giá tiền</th>
              <th>Trạng thái tiêm</th>
              <th>Trạng thái thanh toán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.patientAge}</td>
                <td>{appointment.vaccine}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.price}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                    {appointment.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view">Xem</button>
                    <button className="btn-edit">Sửa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VaccinationHistory;