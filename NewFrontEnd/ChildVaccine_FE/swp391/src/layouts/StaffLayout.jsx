import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StaffSidebar from '../components/shared/StaffSidebar';
import { useAuth } from '../context/AuthContext';
import sessionService from '../service/sessionService';
import '../styles/StaffStyles/StaffLayout.css';



const StaffLayout = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const validateStaffSession = async () => {
  //     try {
  //       setIsLoading(true);
  //       // Kiểm tra session có tồn tại không
  //       const sessionData = await sessionService.checkStaffSession();

  //       console.log('Session Staff data:', sessionData);
  //       console.log('Session Staff body:', sessionData.body);
  //       console.log('Session Staff role:', sessionData.body.role);
        
  //       // Kiểm tra xem có session data không và có phải STAFF không
  //       if (!sessionData || !sessionData.body || sessionData.body.role !== 'STAFF') {
  //         console.log('Invalid staff session, redirecting to login');
  //         await logout();
  //         navigate('/login');
  //         return;
  //       }
        
  //       // Session hợp lệ
  //       console.log('Valid staff session');
  //     } catch (error) {
  //       console.error('Error validating staff session:', error);
  //       setError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
        
  //       // Logout và chuyển về trang đăng nhập
  //       setTimeout(async () => {
  //         await logout();
  //         navigate('/login');
  //       }, 1500);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   validateStaffSession();
  // }, [logout, navigate]);

  // // Nếu đang loading, hiển thị trạng thái loading
  // if (isLoading) {
  //   return (
  //     <div className="staff-loading">
  //       <div className="loading-spinner"></div>
  //       <p>Đang kiểm tra phiên làm việc...</p>
  //     </div>
  //   );
  // }

  // // Nếu có lỗi, hiển thị thông báo lỗi
  // if (error) {
  //   return (
  //     <div className="staff-error">
  //       <div className="error-icon">⚠️</div>
  //       <p>{error}</p>
  //       <p>Đang chuyển hướng đến trang đăng nhập...</p>
  //     </div>
  //   );
  // }

  // // Nếu không có user hoặc role không phải STAFF, chuyển về login
  // if (!user || user.role !== 'STAFF') {
  //   navigate('/login');
  //   return null;
  // }

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