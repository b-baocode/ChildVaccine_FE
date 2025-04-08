import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaClock,
  FaSyringe,
  FaInfo,
  FaTimes,
  FaAngleDown,
  FaAngleUp,
  FaCalendarCheck,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import customerService from "../../service/customerService";
import scheduleService from "../../service/scheduleService";
import appointmentService from "../../service/appointmentService";
import "../../styles/AdminStyles/CustomerManage.css";

const CustomerManage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Thay đổi từ customerHistory sang schedules
  const [schedules, setSchedules] = useState([]);
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({});

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list, detail, history

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách khách hàng. Vui lòng thử lại sau.");
      console.error("Lỗi khi tải danh sách khách hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      await loadCustomers();
      return;
    }

    try {
      setLoading(true);
      const results = await customerService.searchCustomers(searchTerm);
      setCustomers(Array.isArray(results) ? results : [results]);
      setError(null);
    } catch (err) {
      setError("Không thể tìm kiếm khách hàng. Vui lòng thử lại sau.");
      console.error("Lỗi khi tìm kiếm khách hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewMode("detail");
  };

  // Cập nhật hàm handleViewHistory để sử dụng getSchedulesByCustomerId
  const handleViewHistory = async (customer) => {
    setSelectedCustomer(customer);
    setViewMode("history");
    setExpandedScheduleId(null);
    setAppointmentDetails({});

    try {
      setHistoryLoading(true);

      // Sử dụng trực tiếp scheduleService thay vì customerService
      const response = await scheduleService.getSchedulesByCustomerId(
        customer.cusId
      );

      console.log("Phản hồi API lịch sử tiêm chủng:", response);

      if (response.ok && response.schedules) {
        // Xử lý cấu trúc trả về chuẩn từ scheduleService
        setSchedules(response.schedules);
        setHistoryError(null);
      } else {
        setHistoryError(response.message || "Không thể tải lịch sử tiêm chủng");
        setSchedules([]);
      }
    } catch (err) {
      setHistoryError(
        "Không thể tải lịch sử tiêm chủng. Vui lòng thử lại sau."
      );
      console.error("Lỗi khi tải lịch sử tiêm chủng:", err);
      setSchedules([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Hàm mới để toggle mở rộng schedule và tải appointments
  const toggleScheduleExpand = async (scheduleId) => {
    if (expandedScheduleId === scheduleId) {
      setExpandedScheduleId(null);
      return;
    }

    setExpandedScheduleId(scheduleId);

    // Nếu chưa có dữ liệu appointments cho schedule này
    if (!appointmentDetails[scheduleId]) {
      try {
        // Giả định rằng có appointmentService với hàm getAppointmentsByScheduleId
        const response = await appointmentService.getAppointmentsByScheduleId(
          scheduleId
        );

        console.log(`Appointments cho schedule ${scheduleId}:`, response);

        if (response.ok && response.appointments) {
          setAppointmentDetails((prev) => ({
            ...prev,
            [scheduleId]: response.appointments,
          }));
        } else {
          console.error(`Không thể tải chi tiết lịch hẹn: ${response.message}`);
          setAppointmentDetails((prev) => ({
            ...prev,
            [scheduleId]: [],
          }));
        }
      } catch (err) {
        console.error(
          `Không thể tải chi tiết lịch hẹn cho schedule ${scheduleId}:`,
          err
        );
        setAppointmentDetails((prev) => ({
          ...prev,
          [scheduleId]: [],
        }));
      }
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCustomer(null);
    setSchedules([]);
    setAppointmentDetails({});
    setExpandedScheduleId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "status-pending";
      case "COMPLETED":
        return "status-completed";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const translateStatus = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Đang chờ";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status || "N/A";
    }
  };

  const renderCustomersList = () => {
    if (loading) {
      return <div className="loading-spinner">Đang tải dữ liệu...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (customers.length === 0) {
      return <div className="no-results">Không tìm thấy khách hàng nào</div>;
    }

    return (
      <div className="customers-grid">
        {customers.map((customer) => (
          <div key={customer.cusId} className="customer-card">
            <div className="customer-card-header">
              <h3>{customer.fullName}</h3>
              <span className="customer-id">{customer.cusId}</span>
            </div>
            <div className="customer-info">
              <div className="info-item">
                <FaEnvelope className="icon" />
                <span>{customer.email}</span>
              </div>
              <div className="info-item">
                <FaPhone className="icon" />
                <span>{customer.phone || "N/A"}</span>
              </div>
              <div className="info-item">
                <FaVenusMars className="icon" />
                <span>{customer.gender === "MALE" ? "Nam" : "Nữ"}</span>
              </div>
              <div className="info-item">
                <FaCalendarAlt className="icon" />
                <span>{formatDate(customer.dateOfBirth)}</span>
              </div>
            </div>
            <div className="customer-actions">
              <button
                className="view-details-btn"
                onClick={() => handleViewCustomer(customer)}
              >
                <FaInfo /> Chi tiết
              </button>
              <button
                className="view-history-btn"
                onClick={() => handleViewHistory(customer)}
              >
                <FaSyringe /> Lịch sử tiêm
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomerDetail = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="customer-detail-container">
        <div className="detail-header">
          <button className="back-button" onClick={handleBackToList}>
            <FaTimes /> Đóng
          </button>
          <h2>Thông tin khách hàng</h2>
        </div>

        <div className="customer-profile">
          <div className="customer-avatar">
            <FaUser size={60} />
          </div>

          <div className="profile-details">
            <h3>{selectedCustomer.fullName}</h3>
            <div className="profile-id">ID: {selectedCustomer.cusId}</div>

            <div className="profile-info-grid">
              <div className="profile-info-item">
                <FaEnvelope className="icon" />
                <div>
                  <strong>Email</strong>
                  <p>{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <FaPhone className="icon" />
                <div>
                  <strong>Điện thoại</strong>
                  <p>{selectedCustomer.phone || "N/A"}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <FaVenusMars className="icon" />
                <div>
                  <strong>Giới tính</strong>
                  <p>{selectedCustomer.gender === "MALE" ? "Nam" : "Nữ"}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <FaCalendarAlt className="icon" />
                <div>
                  <strong>Ngày sinh</strong>
                  <p>{formatDate(selectedCustomer.dateOfBirth)}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <FaMapMarkerAlt className="icon" />
                <div>
                  <strong>Địa chỉ</strong>
                  <p>{selectedCustomer.address || "N/A"}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <FaInfo className="icon" />
                <div>
                  <strong>User ID</strong>
                  <p>{selectedCustomer.userId || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button
            className="view-history-btn"
            onClick={() => handleViewHistory(selectedCustomer)}
          >
            <FaSyringe /> Xem lịch sử tiêm
          </button>
        </div>
      </div>
    );
  };

  // Hoàn toàn cập nhật hàm renderVaccinationHistory để phù hợp với cấu trúc schedule-appointments
  const renderVaccinationHistory = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="history-container">
        <div className="detail-header">
          <button className="back-button" onClick={handleBackToList}>
            <FaTimes /> Đóng
          </button>
          <h2>Lịch sử tiêm chủng - {selectedCustomer.fullName}</h2>
        </div>

        {historyLoading && (
          <div className="loading-spinner">Đang tải dữ liệu...</div>
        )}

        {historyError && <div className="error-message">{historyError}</div>}

        {!historyLoading &&
          !historyError &&
          (schedules.length > 0 ? (
            <div className="schedule-history-list">
              {schedules.map((schedule) => (
                <div key={schedule.scheduleId} className="schedule-item">
                  <div
                    className="schedule-header"
                    onClick={() => toggleScheduleExpand(schedule.scheduleId)}
                  >
                    <div className="schedule-info">
                      <div className="schedule-id">
                        <FaCalendarCheck className="icon" />
                        <span>Lịch tiêm #{schedule.scheduleId}</span>
                      </div>
                      <div className="schedule-name">
                        <FaSyringe className="icon" />
                        <span>
                          {schedule.packageName
                            ? `Gói: ${schedule.packageName}`
                            : `Vaccine: ${schedule.vaccineName}`}
                        </span>
                      </div>
                      <div className="schedule-child">
                        <FaUser className="icon" />
                        <span>Trẻ: {schedule.childName}</span>
                      </div>
                      <div className="schedule-date">
                        <FaCalendarAlt className="icon" />
                        <span>{formatDate(schedule.startDate)}</span>
                      </div>
                      <div
                        className={`schedule-status ${getStatusClass(
                          schedule.status
                        )}`}
                      >
                        {translateStatus(schedule.status)}
                      </div>
                    </div>
                    <div className="schedule-expand">
                      {expandedScheduleId === schedule.scheduleId ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )}
                    </div>
                  </div>

                  {expandedScheduleId === schedule.scheduleId && (
                    <div className="schedule-details">
                      <div className="schedule-detail-section">
                        <h4>Chi tiết lịch tiêm</h4>
                        <div className="schedule-detail-grid">
                          <div className="schedule-detail-item">
                            <FaSyringe className="icon" />
                            <div>
                              <strong>Dịch vụ</strong>
                              <p>
                                {schedule.packageName
                                  ? `Gói: ${schedule.packageName}`
                                  : `Vaccine: ${schedule.vaccineName}`}
                              </p>
                            </div>
                          </div>
                          <div className="schedule-detail-item">
                            <FaUser className="icon" />
                            <div>
                              <strong>Trẻ</strong>
                              <p>{schedule.childName}</p>
                            </div>
                          </div>
                          <div className="schedule-detail-item">
                            <FaCalendarAlt className="icon" />
                            <div>
                              <strong>Ngày bắt đầu</strong>
                              <p>{formatDate(schedule.startDate)}</p>
                            </div>
                          </div>
                          <div className="schedule-detail-item">
                            <FaInfo className="icon" />
                            <div>
                              <strong>Tổng số mũi</strong>
                              <p>{schedule.totalShot}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="appointments-section">
                        <h4>Các buổi hẹn</h4>

                        {!appointmentDetails[schedule.scheduleId] ? (
                          <div className="loading-text">
                            Đang tải chi tiết lịch hẹn...
                          </div>
                        ) : appointmentDetails[schedule.scheduleId].length >
                          0 ? (
                          <div className="appointments-list">
                            {appointmentDetails[schedule.scheduleId].map(
                              (appointment) => (
                                <div
                                  key={appointment.appId}
                                  className="appointment-item"
                                >
                                  <div className="appointment-header">
                                    <div className="appointment-id">
                                      <strong>Mã lịch hẹn:</strong>{" "}
                                      {appointment.appId}
                                    </div>
                                    <div
                                      className={`appointment-status ${getStatusClass(
                                        appointment.status
                                      )}`}
                                    >
                                      {translateStatus(appointment.status)}
                                    </div>
                                  </div>

                                  <div className="appointment-content">
                                    <div className="appointment-info-grid">
                                      <div className="appointment-info-item">
                                        <FaSyringe className="icon" />
                                        <div>
                                          <strong>Dịch vụ</strong>
                                          <p>{appointment.serviceName}</p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaUser className="icon" />
                                        <div>
                                          <strong>Trẻ</strong>
                                          <p>{appointment.childName}</p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaCalendarAlt className="icon" />
                                        <div>
                                          <strong>Ngày hẹn</strong>
                                          <p>
                                            {formatDate(
                                              appointment.appointmentDate
                                            )}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaClock className="icon" />
                                        <div>
                                          <strong>Giờ hẹn</strong>
                                          <p>
                                            {appointment.appointmentTime?.substring(
                                              0,
                                              5
                                            )}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaInfo className="icon" />
                                        <div>
                                          <strong>Mũi số</strong>
                                          <p>{appointment.shotNumber}</p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaFileInvoiceDollar className="icon" />
                                        <div>
                                          <strong>Thanh toán</strong>
                                          <p
                                            className={`payment-status-${appointment.paymentStatus?.toLowerCase()}`}
                                          >
                                            {appointment.paymentStatus ===
                                            "PENDING"
                                              ? "Chưa thanh toán"
                                              : appointment.paymentStatus ===
                                                "COMPLETED"
                                              ? "Đã thanh toán"
                                              : appointment.paymentStatus ||
                                                "N/A"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaEnvelope className="icon" />
                                        <div>
                                          <strong>Thông báo</strong>
                                          <p>
                                            {appointment.mailNotice ===
                                            "PENDING"
                                              ? "Chưa gửi"
                                              : appointment.mailNotice ===
                                                "SENT"
                                              ? "Đã gửi"
                                              : appointment.mailNotice || "N/A"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaPhone className="icon" />
                                        <div>
                                          <strong>Số điện thoại</strong>
                                          <p>{appointment.phoneNumber}</p>
                                        </div>
                                      </div>

                                      <div className="appointment-info-item">
                                        <FaFileInvoiceDollar className="icon" />
                                        <div>
                                          <strong>Giá</strong>
                                          <p>
                                            {formatCurrency(appointment.price)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="no-appointments">
                            Không có lịch hẹn nào trong lịch tiêm này
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">Không tìm thấy lịch tiêm nào</div>
          ))}
      </div>
    );
  };

  return (
    <div className="customer-manage-container">
      <div className="customer-header">
        <h1>Quản lý Khách hàng</h1>

        {viewMode === "list" && (
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm khách hàng theo tên, email hoặc SĐT..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                <FaSearch /> Tìm kiếm
              </button>
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    setSearchTerm("");
                    loadCustomers();
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      <div className="customer-content">
        {viewMode === "list" && renderCustomersList()}
        {viewMode === "detail" && renderCustomerDetail()}
        {viewMode === "history" && renderVaccinationHistory()}
      </div>
    </div>
  );
};

export default CustomerManage;
