import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/AdminStyles/AdminSidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/staff', icon: '👥', label: 'Quản lý nhân viên' },
    { path: '/admin/vaccination-history', icon: '💉', label: 'Lịch sử đơn tiêm' },
    { path: '/admin/feedback', icon: '⭐', label: 'Feedback & Rating' },
    { path: '/admin/revenue', icon: '💰', label: 'Doanh thu' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>VHTBP-Vaccine</h2>
      </div>
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;