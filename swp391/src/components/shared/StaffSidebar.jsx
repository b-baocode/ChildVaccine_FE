import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaSyringe,
  FaUserMd,
  FaClipboardList,
  FaExclamationCircle
} from 'react-icons/fa';
import '../../styles/StaffStyles/StaffSidebar.css';

const StaffSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/staff/appointment-info',
      icon: <FaCalendarCheck />,
      title: 'Quản lý lịch hẹn'
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
          <img src="/staff-avatar.png" alt="Staff" className="staff-avatar" />
          <div className="staff-details">
            <p className="staff-name">Nhân viên y tế</p>
            <p className="staff-role">Y tá tiêm chủng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;