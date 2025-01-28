import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/shared/AdminSidebar';
import { Bell, Mail, ChevronDown } from 'lucide-react';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  
  // Hàm để lấy tiêu đề trang dựa trên pathname
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Dashboard';
      case '/admin/staff':
        return 'Quản lý nhân viên';
      case '/admin/vaccination-history':
        return 'Lịch sử đơn tiêm';
      case '/admin/feedback':
        return 'Feedback & Rating';
      case '/admin/revenue':
        return 'Doanh thu';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <div className="header-title">
            <h1>{getPageTitle()}</h1>
            <p>Welcome back, Admin</p>
          </div>
          <div className="user-profile">
            <div className="notification">
              <Bell size={20} />
            </div>
            <div className="messages">
              <Mail size={20} />
            </div>
            <div className="avatar">
              <img src="/avatar-default.jpg" alt="Admin" />
              <span>John Doe</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;