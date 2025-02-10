import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/StaffStyles/StaffSidebar.css';

const StaffSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/staff/appointment-info', label: 'Thông tin lịch hẹn' },
    { path: '/staff/post-vaccination-info', label: 'Thông tin phản ứng sau tiêm' },
    { path: '/staff/customer-profiles', label: 'Hồ sơ khách hàng' },
    { path: '/staff/child-profiles', label: 'Hồ sơ trẻ em' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">VHTBP-Vaccine</div>
      <nav className="menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default StaffSidebar;