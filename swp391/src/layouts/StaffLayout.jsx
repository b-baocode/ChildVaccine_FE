import React from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from '../components/shared/StaffSidebar';
import '../styles/StaffStyles/StaffLayout.css';



const StaffLayout = () => {
  return (
    <div className="staff-layout">
      <StaffSidebar />
      <div className="staff-content">
        <div className="staff-header">
          <div className="page-title">
            <h1>Quản lý Tiêm chủng</h1>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <input 
                type="search" 
                placeholder="Tìm kiếm hồ sơ..." 
                className="search-input"
              />
            </div>
          </div>
        </div>
        
        <main className="staff-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;