import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaSyringe,
  FaUserMd,
  FaClipboardList,
  FaExclamationCircle,
  FaSignOutAlt,
  FaCalendarAlt // Thêm icon đăng xuất
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Thêm import useAuth
import '../../styles/StaffStyles/StaffSidebar.css';

const StaffSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); // Lấy hàm logout từ context
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false); // Thêm state cho dialog

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutDialog(false);
      // Optional: Show logout success message
      const modal = document.createElement('div');
      modal.className = 'success-modal';
      modal.innerHTML = `
        <div class="success-content">
          <h3>Đăng xuất thành công</h3>
          <p>Hẹn gặp lại!</p>
        </div>
      `;
      document.body.appendChild(modal);
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 1500);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      path: '/staff/appointment-info',
      icon: <FaCalendarCheck />,
      title: 'Quản lý buổi hẹn'
    },
    {
      path: '/staff/schedule-info', // Add new path for ScheduleInfo
      icon: <FaCalendarAlt />,
      title: 'Quản lý lịch tiêm'
    },
    {
      path: '/staff/child-profiles',
      icon: <FaUserMd />,
      title: 'Hồ sơ bệnh nhân'
    },
    {
      path: '/staff/post-vaccination-info',
      icon: <FaExclamationCircle />,
      title: 'Phản ứng sau tiêm'
    }
  ];

  return (
    <div className="staff-sidebar">
      <div className="sidebar-header">
        <img src="https://vnvc.vn/img/logo-tet-vnvc.png" alt="Logo" className="sidebar-logo" />
        <h2>Trung tâm Tiêm chủng</h2>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-title">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="staff-info">
          <div className="staff-details">
            <p className="staff-name">Nhân viên y tế</p>
            <p className="staff-role">Y tá tiêm chủng</p>
          </div>
        </div>
        <button 
          className="logout-button"
          onClick={handleLogoutConfirm}
        >
          <span className="sidebar-icon"><FaSignOutAlt /></span>
          <span className="logout-title">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar;