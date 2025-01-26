import React, { useState } from 'react';
import { Search, Phone, LogOut, Calendar, MessageSquare, UserCircle, AlertCircle } from 'lucide-react';
import '../styles/Staff.css';

function Staff() {
  const [activeSection, setActiveSection] = useState('appointments');

  const appointments = [
    { id: 'AP001', cusName: 'Nguyễn Văn A', vaccine: 'Covid-19', price: '1,500,000đ', status: 'Đã tiêm', date: '2024-03-15' },
    { id: 'AP002', cusName: 'Trần Thị B', vaccine: 'Viêm gan B', price: '850,000đ', status: 'Chờ tiêm', date: '2024-03-16' },
    { id: 'AP003', cusName: 'Lê Văn C', vaccine: 'Cúm mùa', price: '750,000đ', status: 'Đã hủy', date: '2024-03-17' },
    { id: 'AP004', cusName: 'Phạm Thị D', vaccine: 'HPV', price: '2,500,000đ', status: 'Chờ tiêm', date: '2024-03-18' },
  ];

  const customerProfiles = [
    { id: 'CUS001', name: 'Nguyễn Văn A', dob: '1990-01-01', gender: 'Nam', phone: '0901234567' },
    { id: 'CUS002', name: 'Trần Thị B', dob: '1992-02-02', gender: 'Nữ', phone: '0902345678' },
    { id: 'CUS003', name: 'Lê Văn C', dob: '1985-03-03', gender: 'Nam', phone: '0903456789' },
    { id: 'CUS004', name: 'Phạm Thị D', dob: '1995-04-04', gender: 'Nữ', phone: '0904567890' },
  ];

  const vaccinationReactions = [
    { 
      appointmentId: 'AP001', 
      cusName: 'Nguyễn Văn A',
      reaction: 'Sốt nhẹ, đau tại chỗ tiêm',
      date: '2024-03-15',
      severity: 'Nhẹ',
      followUpNeeded: 'Không'
    },
    { 
      appointmentId: 'AP002', 
      cusName: 'Trần Thị B',
      reaction: 'Đau đầu, mệt mỏi',
      date: '2024-03-16',
      severity: 'Trung bình',
      followUpNeeded: 'Có'
    },
  ];

  return (
    <div className="home">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-content">
          <span>Trung tâm tiêm chủng Long Châu</span>
          <div className="banner-actions">
            <a href="tel:18006928" className="banner-action">
              <Phone size={16} />
              <span>1800 6928</span>
            </a>
            <a href="#" className="banner-action">
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <nav className="menu">
            <a href="#" className="menu-item" onClick={() => setActiveSection('appointments')}>
              <Calendar size={20} />
              <span>Thông tin lịch hẹn</span>
            </a>
            <a href="#" className="menu-item" onClick={() => setActiveSection('reactions')}>
              <AlertCircle size={20} />
              <span>Thông tin phản ứng sau tiêm</span>
            </a>
            <a href="#" className="menu-item" onClick={() => setActiveSection('customerProfiles')}>
              <UserCircle size={20} />
              <span>Hồ sơ khách hàng</span>
            </a>
          </nav>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          {activeSection === 'appointments' && (
            <>
              <h1>Danh sách lịch hẹn</h1>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên khách hàng</th>
                      <th>Vaccine</th>
                      <th>Giá tiền</th>
                      <th>Trạng thái</th>
                      <th>Ngày hẹn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.cusName}</td>
                        <td>{appointment.vaccine}</td>
                        <td>{appointment.price}</td>
                        <td className={
                          appointment.status === 'Đã tiêm' ? 'status-done' :
                          appointment.status === 'Chờ tiêm' ? 'status-pending' :
                          'status-cancelled'
                        }>
                          {appointment.status}
                        </td>
                        <td>{appointment.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === 'customerProfiles' && (
            <>
              <h1>Hồ sơ khách hàng</h1>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Ngày sinh</th>
                      <th>Giới tính</th>
                      <th>Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerProfiles.map((profile) => (
                      <tr key={profile.id}>
                        <td>{profile.id}</td>
                        <td>{profile.name}</td>
                        <td>{profile.dob}</td>
                        <td>{profile.gender}</td>
                        <td>{profile.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === 'reactions' && (
            <>
              <h1 className="reactions-title">Thông tin phản ứng sau tiêm</h1>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID Lịch hẹn</th>
                      <th>Tên khách hàng</th>
                      <th>Phản ứng</th>
                      <th>Ngày</th>
                      <th>Mức độ</th>
                      <th>Cần theo dõi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinationReactions.map((reaction) => (
                      <tr key={reaction.appointmentId}>
                        <td>{reaction.appointmentId}</td>
                        <td>{reaction.cusName}</td>
                        <td>{reaction.reaction}</td>
                        <td>{reaction.date}</td>
                        <td>
                          <span className={`reactions-severity ${
                            reaction.severity === 'Nhẹ' ? 'reactions-severity-mild' :
                            reaction.severity === 'Trung bình' ? 'reactions-severity-moderate' :
                            'reactions-severity-none'
                          }`}>
                            {reaction.severity}
                          </span>
                        </td>
                        <td>{reaction.followUpNeeded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Staff;