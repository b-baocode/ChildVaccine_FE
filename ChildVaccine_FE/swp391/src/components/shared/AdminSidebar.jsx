import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/AdminStyles/AdminSidebar.css";
import sessionService from "../../service/sessionService";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/admin/staff", icon: "👥", label: "Quản lý nhân viên" },
    {
      path: "/admin/vaccination-history",
      icon: "💉",
      label: "Lịch sử đơn tiêm",
    },
    { path: "/admin/feedback", icon: "⭐", label: "Feedback & Rating" },
    { path: "/admin/revenue", icon: "💰", label: "Doanh thu" },
  ];

  const handleLogout = () => {
    // Gọi hàm syncLogout từ sessionService để xóa token và thông tin đăng nhập
    sessionService.syncLogout();
    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

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
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}

        {/* Nút đăng xuất */}
        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Đăng xuất</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
