import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import scheduleService from '../../service/adminService';
import styles from '../../styles/AdminStyles/VaccinationHistory.css';
import overlayStyles from '../../styles/AdminStyles/Modules/OverlayVaccinationHistory.module.css';

const AppointmentOverlay = ({ appointments, selectedSchedule, onClose, getStatusColor, mapStatus, getPaymentStatusColor, mapPaymentStatus }) => {
  return (
    <div className={overlayStyles["overlay"]}>
      <div className={overlayStyles["overlay-content"]}>
        <div className={overlayStyles["overlay-header"]}>
          <h3>Lịch hẹn cho lộ trình {selectedSchedule}</h3>
          <button onClick={onClose} className={overlayStyles["close-button"]}>×</button>
        </div>
        <div className={overlayStyles["appointments-table-container"]}>
          <table className={overlayStyles["appointments-table"]}>
            <thead>
              <tr>
                <th>ID Lịch hẹn</th>
                <th>Ngày hẹn</th>
                <th>Giờ hẹn</th>
                <th>Mũi số</th>
                <th>Vaccine</th>
                <th>Giá tiền</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Thông báo</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appId}>
                  <td>{appointment.appId}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.shotNumber}</td>
                  <td>{appointment.vaccine.name}</td>
                  <td>{appointment.vaccine.price}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                      {mapStatus(appointment.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-badge ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                      {mapPaymentStatus(appointment.paymentStatus)}
                    </span>
                  </td>
                  <td>{appointment.mailNotice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const VaccinationHistory = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [scheduleRevenues, setScheduleRevenues] = useState({});
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const fetchScheduleRevenue = async (scheduleId) => {
    try {
      console.log('Fetching revenue for schedule:', scheduleId);
      const revenue = await scheduleService.getRevenueByScheduleId(scheduleId);
      console.log('Revenue received:', revenue);
      if (revenue !== undefined && revenue !== null) {
        setScheduleRevenues(prev => ({
          ...prev,
          [scheduleId]: revenue
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch revenue for schedule ${scheduleId}:`, error);
      setScheduleRevenues(prev => ({
        ...prev,
        [scheduleId]: 0
      }));
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await fetchSchedules();
        // Only fetch revenues if schedules are loaded
        if (schedules && schedules.length > 0) {
          console.log('Fetching revenues for schedules:', schedules);
          await Promise.all(schedules.map(schedule =>
            fetchScheduleRevenue(schedule.scheduleId)
          ));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAllData();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await scheduleService.getAllSchedules();
      console.log('Schedules received:', response);
  
      if (!response) {
        throw new Error('No data received from server');
      }
  
      const schedulesArray = Array.isArray(response) ? response : [response];
      setSchedules(schedulesArray);
      
      // Fetch revenues immediately after setting schedules
      await Promise.all(schedulesArray.map(schedule => 
        fetchScheduleRevenue(schedule.scheduleId)
      ));
  
      setError(null);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setError(error.message || 'Failed to load schedules');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };



  const handleViewAppointments = async (scheduleId) => {
    setLoadingAppointments(true);
    try {
      const response = await scheduleService.getAppointmentsByScheduleId(scheduleId);
      setAppointments(response);
      setSelectedSchedule(scheduleId);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const mapStatus = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Đang thực hiện';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const mapPaymentStatus = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ thanh toán';
      case 'PAID': return 'Đã thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'payment-pending';
      case 'PAID': return 'payment-completed';
      case 'CANCELLED': return 'payment-cancelled';
      default: return '';
    }
  };

  const handleCloseOverlay = () => {
    setSelectedSchedule(null);
    setAppointments([]);
  };

  const filteredSchedules = Array.isArray(schedules) ? schedules.filter(schedule => {
    if (!schedule) return false;
    return (
      (schedule.scheduleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.childId?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || schedule.status === statusFilter)
    );
  }) : [];

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles["vaccination-history"]}>
      <h2>Danh sách lộ trình tiêm chủng</h2>

      <div className="search-filters">
        <div className="search-field">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID lộ trình"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-field">
          <select value={statusFilter} onChange={handleStatusChange}>
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang thực hiện</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className={styles["schedules-table"]}>
        <table>
          <thead>
            <tr>
              <th>ID Lộ trình</th>
              <th>ID Khách hàng</th>
              <th>Tên Khách hàng</th>
              <th>Họ và tên trẻ</th>
              <th>Vaccine/Gói</th>
              <th>Ngày bắt đầu</th>
              <th>Tổng mũi tiêm</th>
              <th>Trạng thái</th>
              <th>Doanh thu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.scheduleId}>
                <td>{schedule.scheduleId}</td>
                <td>{schedule.cusId}</td>
                <td>{schedule.cusName}</td>
                <td>{schedule.childName}</td>
                <td>
                  {schedule.vaccineName ?
                    `${schedule.vaccineName}` :
                    `${schedule.packageName}`}
                </td>
                <td>{new Date(schedule.startDate).toLocaleDateString('vi-VN')}</td>
                <td>{schedule.totalShot}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(schedule.status)}`}>
                    {mapStatus(schedule.status)}
                  </span>
                </td>
                <td>
                  {scheduleRevenues[schedule.scheduleId] !== undefined ? (
                    new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(scheduleRevenues[schedule.scheduleId] || 0)
                  ) : (
                    <span className={styles["loading-text"]}>Đang tải...</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleViewAppointments(schedule.scheduleId)}
                    className={styles["view-appointments-btn"]}
                  >
                    Xem lịch hẹn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {selectedSchedule && appointments.length > 0 && (
        <AppointmentOverlay
          appointments={appointments}
          selectedSchedule={selectedSchedule}
          onClose={handleCloseOverlay}
          getStatusColor={getStatusColor}
          mapStatus={mapStatus}
          getPaymentStatusColor={getPaymentStatusColor}
          mapPaymentStatus={mapPaymentStatus}
        />
      )}
    </div>
  );
};

export default VaccinationHistory;