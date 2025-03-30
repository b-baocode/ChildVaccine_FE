import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StaffSidebar from "../components/shared/StaffSidebar";
import sessionService from "../service/sessionService";
import "../styles/StaffStyles/StaffLayout.css";

const StaffLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [showHeader, setShowHeader] = useState(true);

  const layoutContext = {
    staffInfo,
    hideHeader: () => setShowHeader(false),
    showHeader: () => setShowHeader(true),
    setShowHeader,
  };

  useEffect(() => {
    const checkStaffSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Kiểm tra token và user
        if (!localStorage.getItem("authToken")) {
          console.log("Không tìm thấy token, chuyển hướng đến trang đăng nhập");
          navigate("/login");
          return;
        }

        if (!user) {
          console.log(
            "Không có thông tin user, chuyển hướng đến trang đăng nhập"
          );
          navigate("/login");
          return;
        }

        if (user.role !== "STAFF") {
          console.log(
            "User không phải là nhân viên, chuyển hướng đến trang chủ"
          );
          navigate("/");
          return;
        }

        // Kiểm tra session staff
        console.log("Đang kiểm tra session staff...");
        const response = await sessionService.checkStaffSession();

        if (!response || !response.success) {
          console.error(
            "Session staff không hợp lệ:",
            response?.message || "Không có phản hồi"
          );
          await logout();
          navigate("/login");
          return;
        }

        console.log("Session staff hợp lệ:", response.body);

        // Lưu thông tin staff để sử dụng trong các components con
        setStaffInfo(response.body);
      } catch (error) {
        console.error("Lỗi kiểm tra session staff:", error);
        setError("Có lỗi xảy ra khi xác thực phiên làm việc");
        await logout();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkStaffSession();
  }, [user, navigate, logout]);

  if (isLoading) {
    return (
      <div className="staff-loading">
        <div className="spinner"></div>
        <p>Đang kiểm tra phiên làm việc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-error">
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Đăng nhập lại</button>
      </div>
    );
  }

  return (
    <div className="staff-layout">
      <StaffSidebar />
      <div className="staff-content">
        <div className="staff-header">
          <div className="page-title">
            <h1>Quản lý Tiêm chủng</h1>
          </div>
        </div>

        <main className="staff-main">
          <div>
            {staffInfo && showHeader && (
              <header>
                <h1>Xin chào, {staffInfo.fullName}</h1>
                <p>Bộ phận: {staffInfo.department}</p>
              </header>
            )}
            <Outlet context={layoutContext} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
