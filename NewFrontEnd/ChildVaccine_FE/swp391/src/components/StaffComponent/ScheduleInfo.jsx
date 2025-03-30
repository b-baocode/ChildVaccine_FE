import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import scheduleService from '../../service/scheduleService';
import { FaSearch, FaFilter, FaSort, FaEye, FaDownload } from 'react-icons/fa';
import '../../styles/StaffStyles/ScheduleInfo.css';

const ScheduleInfo = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Bước 1: Lấy tất cả các schedule
      const response = await scheduleService.getAllSchedules();
      
      if (response.ok) {
        const schedulesData = response.schedules || [];
        
        // Bước 2: Lọc ra các schedule có trạng thái ACTIVE để kiểm tra
        const activeSchedules = schedulesData.filter(schedule => schedule.status === 'ACTIVE');
        
        if (activeSchedules.length > 0) {
          console.log(`Kiểm tra trạng thái cho ${activeSchedules.length} schedules đang ACTIVE`);
          let hasUpdates = false;
          
          // Bước 3: Kiểm tra từng schedule ACTIVE
          // Xử lý theo batch để không gây quá tải API
          const batchSize = 5;
          for (let i = 0; i < activeSchedules.length; i += batchSize) {
            const batch = activeSchedules.slice(i, i + batchSize);
            const updatePromises = batch.map(schedule => 
              scheduleService.updateStatusIfCompleted(schedule.scheduleId)
                .then(result => {
                  if (result.ok && result.updated) {
                    console.log(`Schedule ${schedule.scheduleId} đã được cập nhật thành COMPLETED`);
                    hasUpdates = true;
                  }
                  return result;
                })
            );
            
            await Promise.all(updatePromises);
          }
          
          // Bước 4: Nếu có cập nhật, tải lại danh sách để hiển thị trạng thái mới nhất
          if (hasUpdates) {
            console.log("Có schedules đã được cập nhật, tải lại danh sách");
            const refreshResponse = await scheduleService.getAllSchedules();
            if (refreshResponse.ok) {
              setSchedules(refreshResponse.schedules || []);
            } else {
              setSchedules(schedulesData);
            }
          } else {
            setSchedules(schedulesData);
          }
        } else {
          // Không có schedule ACTIVE nào cần kiểm tra
          setSchedules(schedulesData);
        }
      } else {
        setError(response.message || 'Không thể tải danh sách lịch tiêm');
        console.error('Failed to fetch schedules:', response.message);
      }
    } catch (err) {
      setError('Không thể tải danh sách lịch tiêm. Vui lòng thử lại sau.');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const exportToCSV = () => {
    const headers = ['Mã lịch', 'Mã KH', 'Tên KH', 'Tên trẻ', 'Tên vắc xin', 'Tên gói', 'Ngày bắt đầu', 'Tổng mũi', 'Trạng thái'];
    const csvContent = [
      headers.join(','),
      ...filteredSchedules.map(schedule => [
        schedule.scheduleId,
        schedule.cusId,
        schedule.cusName,
        schedule.childName,
        schedule.vaccineName || '',
        schedule.packageName || '',
        schedule.startDate,
        schedule.totalShot,
        schedule.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vaccination-schedules-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredSchedules = schedules
    .filter(schedule => {
      const matchesSearch = 
        schedule.scheduleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.cusName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (schedule.vaccineName && schedule.vaccineName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.packageName && schedule.packageName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === '' || schedule.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'scheduleId':
          comparison = a.scheduleId.localeCompare(b.scheduleId);
          break;
        case 'cusName':
          comparison = a.cusName.localeCompare(b.cusName);
          break;
        case 'childName':
          comparison = a.childName.localeCompare(b.childName);
          break;
        case 'startDate':
          comparison = new Date(a.startDate) - new Date(b.startDate);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="schedule-management">
      <div className="header-section">
        <h1>Quản lý lịch tiêm chủng</h1>
        <button className="export-btn" onClick={exportToCSV}>
          <FaDownload /> Xuất CSV
        </button>
      </div>
      
      <div className="controls">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, khách hàng, trẻ em, vắc xin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter">
          <label>
            <FaFilter /> Lọc theo trạng thái:
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </label>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="schedules-table-wrapper">
          <table className="schedules-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('scheduleId')}>
                  Mã lịch {sortField === 'scheduleId' && <FaSort />}
                </th>
                <th onClick={() => handleSort('cusName')}>
                  Khách hàng {sortField === 'cusName' && <FaSort />}
                </th>
                <th onClick={() => handleSort('childName')}>
                  Trẻ em {sortField === 'childName' && <FaSort />}
                </th>
                <th>Vắc xin/Gói</th>
                <th onClick={() => handleSort('startDate')}>
                  Ngày bắt đầu {sortField === 'startDate' && <FaSort />}
                </th>
                <th>Tổng mũi</th>
                <th onClick={() => handleSort('status')}>
                  Trạng thái {sortField === 'status' && <FaSort />}
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.scheduleId}>
                    <td>{schedule.scheduleId}</td>
                    <td>{schedule.cusName} ({schedule.cusId})</td>
                    <td>{schedule.childName}</td>
                    <td>
                      {schedule.vaccineName || schedule.packageName}
                      <span className="vaccine-type">
                        {schedule.vaccineName ? '(Vắc xin)' : '(Gói)'}
                      </span>
                    </td>
                    <td>{formatDate(schedule.startDate)}</td>
                    <td>{schedule.totalShot}</td>
                    <td>
                      <span className={`status-badge ${schedule.status.toLowerCase()}`}>
                        {schedule.status === 'ACTIVE' ? 'Đang hoạt động' : 
                         schedule.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => navigate(`/staff/schedules/${schedule.scheduleId}`)}
                      >
                        <FaEye /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">Không tìm thấy lịch tiêm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScheduleInfo;