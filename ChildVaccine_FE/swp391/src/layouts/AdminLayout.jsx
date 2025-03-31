import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/shared/AdminSidebar";
import "../styles/AdminStyles/AdminLayout.css";
import sessionService from "../service/sessionService";

const AdminLayout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // Sử dụng checkAdminSession thay vì checkStaffSession
        const sessionResponse = await sessionService.checkAdminSession();

        if (sessionResponse && sessionResponse.success) {
          setAuthorized(true);
          setAdminData(sessionResponse.body);
        } else {
          console.error(
            "Admin session check failed:",
            sessionResponse?.message
          );
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Hàm để lấy tiêu đề trang dựa trên pathname
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/staff":
        return "Quản lý nhân viên";
      case "/admin/vaccination-history":
        return "Lịch sử đơn tiêm";
      case "/admin/feedback":
        return "Feedback & Rating";
      case "/admin/revenue":
        return "Doanh thu";
      default:
        return "Dashboard";
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  // Chuyển hướng nếu không được phép truy cập
  if (!authorized) {
    // Chuyển về trang đăng nhập chung và lưu đường dẫn hiện tại để quay lại sau
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <div className="header-title">
            <h1>{getPageTitle()}</h1>
            {adminData && <p>Xin chào, {adminData.fullName || "Admin"}</p>}
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
