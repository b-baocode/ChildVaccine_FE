import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import appointmentService from '../../service/appointmentService';
import '../../styles/AdminStyles/VaccinationHistory.css';

const VaccinationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vaccineStatus, setVaccineStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAllAppointments();
        const formattedAppointments = data.map(appointment => ({
          id: appointment.appId,
          patientName: appointment.child.fullName,
          patientAge: calculateAge(appointment.child.dateOfBirth),
          vaccine: appointment.vaccineId ? appointment.vaccineId.vaccineId : 
                  appointment.packageId ? appointment.packageId.packageId : '',
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
          status: mapStatus(appointment.status),
          paymentStatus: mapPaymentStatus(appointment.paymentStatus),
          price: appointment.vaccineId ? 
                appointment.vaccineId.price.toLocaleString('vi-VN') + ' VNĐ' :
                appointment.packageId ? 
                appointment.packageId.price.toLocaleString('vi-VN') + ' VNĐ' : ''
        }));
        setAppointments(formattedAppointments);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        setError('Failed to load appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const mapStatus = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Đã tiêm';
      case 'CONFIRMED': return 'Chưa tiêm';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const mapPaymentStatus = (status) => {
    switch (status) {
      case 'PAID': return 'Đã thanh toán';
      case 'PENDING': return 'Chưa thanh toán';
      default: return status;
    }
  };
  
  

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VaccinationHistory;