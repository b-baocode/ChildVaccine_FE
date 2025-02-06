import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, LogOut } from 'lucide-react';
import '../styles/StaffStyles/StaffStyle.css';

const StaffLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/staff/appointment-info', label: 'Thông tin lịch hẹn' },
    { path: '/staff/post-vaccination-info', label: 'Thông tin phản ứng sau tiêm' },
    { path: '/staff/customer-profiles', label: 'Hồ sơ khách hàng' },
    { path: '/staff/child-profiles', label: 'Hồ sơ trẻ em' },
  ];

  return (
    <div className="staff-page">
      <div className="header">
        <div className="banner-content">
          <div className="left-content">
            <img src="/logo.png" alt="Logo" className="logo" />
            <span>Trung tâm tiêm chủng Long Châu</span>
          </div>
          <div className="right-content">
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

      <div className="main-content">
        <div className="sidebar">
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
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StaffLayout;