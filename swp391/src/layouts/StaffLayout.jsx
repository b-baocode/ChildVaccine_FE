import React from 'react';
import { Outlet } from 'react-router-dom';
import { Phone, LogOut } from 'lucide-react';
import StaffSidebar from '../components/shared/StaffSidebar';
import '../styles/StaffStyles/StaffLayout.css';

const StaffLayout = () => {
  return (
    <div className="staff-page">
      <StaffSidebar />
      <div className="main-content">
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
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StaffLayout;