import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaHome,
  FaCalendar,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/CusStyles/Profile.css";
import customerService from "../../service/customerService";
import sessionService from "../../service/sessionService";
import appointmentService from "../../service/appointmentService";
import scheduleService from "../../service/scheduleService";
import { FaStar } from "react-icons/fa";
import feedbackService from "../../service/feedbackService";
import paymentService from "../../service/paymentService";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments"); // 'appointments' or 'schedules'

  const [editedInfo, setEditedInfo] = useState({
    phone: "",
    address: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loadingAppointmentId, setLoadingAppointmentId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleAppointments, setScheduleAppointments] = useState([]);
  const [loadingScheduleDetails, setLoadingScheduleDetails] = useState(false);
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
  const [scheduleFilterStatus, setScheduleFilterStatus] = useState("");
  const [scheduleSortField, setScheduleSortField] = useState("startDate");
  const [scheduleSortDirection, setScheduleSortDirection] = useState("desc");
  const [pendingFeedbackAppointments, setPendingFeedbackAppointments] =
    useState([]);
  const [appointmentFeedbacks, setAppointmentFeedbacks] = useState({});
  // Thêm vào phần khai báo state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("");
  const [reschedulingAppointment, setReschedulingAppointment] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const sessionData = await sessionService.checkSession();
        if (sessionData) {
          const profileData = await customerService.getCustomerProfile(
            sessionData.body.cusId
          );
          setUserInfo({
            name: profileData.fullName,
            id: profileData.cusId,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            gender: profileData.gender,
            dateOfBirth: new Date(profileData.dateOfBirth).toLocaleDateString(),
          });

          // Fetch appointments
          setLoadingAppointments(true);
          const appointmentsData =
            await appointmentService.getAppointmentsByCustomerId(
              sessionData.body.cusId
            );
          setAppointments(appointmentsData);

          // Fetch schedules
          setLoadingSchedules(true);
          const schedulesResponse =
            await scheduleService.getSchedulesByCustomerId(
              sessionData.body.cusId
            );
          if (schedulesResponse.ok) {
            setSchedules(schedulesResponse.schedules || []);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Không thể tải thông tin hồ sơ");
      } finally {
        setLoading(false);
        setLoadingAppointments(false);
        setLoadingSchedules(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        // Lấy danh sách các lịch hẹn đang chờ đánh giá
        const pendingData =
          await feedbackService.getPendingFeedbackAppointments();
        setPendingFeedbackAppointments(pendingData || []);

        // Lấy thông tin đánh giá cho các lịch hẹn đã hoàn thành
        const feedbacksMap = {};
        for (const app of appointments.filter(
          (a) => a.status === "COMPLETED"
        )) {
          const feedback = await feedbackService.getFeedbackByAppointmentId(
            app.appId
          );
          if (feedback) {
            feedbacksMap[app.appId] = feedback;
          }
        }
        setAppointmentFeedbacks(feedbacksMap);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    if (appointments.length > 0) {
      fetchFeedbackData();
    }
  }, [appointments]);

  const handleFeedback = (appointment) => {
    console.log("Feedback for appointment:", appointment);
    if (appointment.hasFeedback) {
      alert("Buổi tiêm này đã được đánh giá.");
      return;
    }
    setSelectedAppointment(appointment);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      setSubmitting(true);

      const feedbackData = {
        appointmentId: selectedAppointment.appId,
        rating: rating,
        feedback: comment.trim(),
      };

      await feedbackService.submitFeedback(feedbackData);

      // Update the appointments list to reflect the feedback status
      setAppointments(
        appointments.map((app) =>
          app.appId === selectedAppointment.appId
            ? { ...app, hasFeedback: true }
            : app
        )
      );

      alert("Cảm ơn bạn đã đánh giá!");

      setShowFeedbackModal(false);
      setSelectedAppointment(null);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
    setSelectedAppointment(null);
    setRating(0);
    setComment("");
  };

  const isPendingFeedback = (appointmentId) => {
    return pendingFeedbackAppointments.some(
      (app) => app.appId === appointmentId
    );
  };

  const getAppointmentFeedback = (appointmentId) => {
    return appointmentFeedbacks[appointmentId] || null;
  };

  // Update handlers to use real data
  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({
      phone: userInfo?.phone || "",
      address: userInfo?.address || "",
    });
  };

  const handleSave = async () => {
    try {
      // Add API call to update customer info here
      setUserInfo((prev) => ({
        ...prev,
        phone: editedInfo.phone,
        address: editedInfo.address,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Không thể cập nhật thông tin");
    }
  };

  const handleOpenCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
    setCancelReason(""); // Reset lý do mỗi lần mở modal
  };

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel || !cancelReason) return;

    try {
      // Show loading state
      setLoadingAppointmentId(appointmentToCancel.appId);

      // Call API to update status to CANCELLED
      const updatedAppointment =
        await appointmentService.updateAppointmentStatus(
          appointmentToCancel.appId,
          "CANCELLED"
        );

      // Update the local state with the cancelled appointment
      setAppointments(
        appointments.map((app) =>
          app.appId === appointmentToCancel.appId
            ? { ...app, status: "CANCELLED" }
            : app
        )
      );

      // Đóng modal và hiển thị thông báo
      setShowCancelModal(false);
      alert("Đã hủy cuộc hẹn thành công");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Không thể hủy cuộc hẹn. Vui lòng thử lại sau.");
    } finally {
      setLoadingAppointmentId(null);
    }
  };

  const handlePayment = async (appointment) => {
    try {
      setProcessingPayment(true);

      // Get payment URL from API
      const paymentUrl = await paymentService.createPayment(appointment.appId);
      console.log("Payment URL:", paymentUrl);

      // Save appointment ID to localStorage to check status after return
      localStorage.setItem("pendingPaymentAppId", appointment.appId);

      // Open VNPay payment page in a new tab instead of redirecting
      const newTab = window.open(paymentUrl, "_blank");

      // Check if popup was blocked
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        alert(
          "Trình duyệt đã chặn cửa sổ thanh toán. Vui lòng cho phép popup và thử lại."
        );
      }

      // Reset processing state after a short delay
      setTimeout(() => {
        setProcessingPayment(false);
      }, 1000);
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Không thể khởi tạo thanh toán. Vui lòng thử lại sau.");
      setProcessingPayment(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleBackHome = () => {
    navigate("/");
  };

  if (loading) return <div className="loading">Đang tải thông tin...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!userInfo)
    return (
      <div className="error-message">Không tìm thấy thông tin người dùng</div>
    );

  const handleViewScheduleDetails = async (scheduleId) => {
    try {
      setLoadingScheduleDetails(true);
      setSelectedSchedule(schedules.find((s) => s.scheduleId === scheduleId));

      const response = await appointmentService.getAppointmentsByScheduleId(
        scheduleId
      );
      if (response.ok) {
        setScheduleAppointments(response.appointments || []);
      } else {
        alert("Không thể tải danh sách cuộc hẹn cho lịch tiêm này.");
      }
    } catch (error) {
      console.error("Error loading schedule details:", error);
      alert("Đã xảy ra lỗi khi tải chi tiết lịch tiêm.");
    } finally {
      setLoadingScheduleDetails(false);
    }
  };

  const handleCloseScheduleDetails = () => {
    setSelectedSchedule(null);
    setScheduleAppointments([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return `${parts[0]}:${parts[1]}`;
  };

  const handleScheduleSort = (field) => {
    const isAsc =
      scheduleSortField === field && scheduleSortDirection === "asc";
    setScheduleSortDirection(isAsc ? "desc" : "asc");
    setScheduleSortField(field);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "status-badge completed";
      case "CONFIRMED":
        return "status-badge confirmed";
      case "PENDING":
        return "status-badge pending";
      case "CANCELLED":
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PENDING":
        return "Chờ xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      case "ACTIVE":
        return "Đang hoạt động";
      default:
        return status;
    }
  };

  // Filtered schedules
  const filteredSchedules = schedules
    .filter((schedule) => {
      const matchesSearch =
        schedule.scheduleId
          ?.toLowerCase()
          .includes(scheduleSearchTerm.toLowerCase()) ||
        schedule.cusName
          ?.toLowerCase()
          .includes(scheduleSearchTerm.toLowerCase()) ||
        schedule.childName
          ?.toLowerCase()
          .includes(scheduleSearchTerm.toLowerCase()) ||
        (schedule.vaccineName &&
          schedule.vaccineName
            .toLowerCase()
            .includes(scheduleSearchTerm.toLowerCase())) ||
        (schedule.packageName &&
          schedule.packageName
            .toLowerCase()
            .includes(scheduleSearchTerm.toLowerCase()));

      const matchesStatus =
        scheduleFilterStatus === "" || schedule.status === scheduleFilterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (scheduleSortField) {
        case "scheduleId":
          comparison = a.scheduleId.localeCompare(b.scheduleId);
          break;
        case "childName":
          comparison = a.childName.localeCompare(b.childName);
          break;
        case "startDate":
          comparison = new Date(a.startDate) - new Date(b.startDate);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return scheduleSortDirection === "asc" ? comparison : -comparison;
    });

  const handleOpenRescheduleModal = (appointment) => {
    setAppointmentToReschedule(appointment);
    // Khởi tạo ngày mặc định (ngày mai)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewAppointmentDate(tomorrow.toISOString().split("T")[0]);
    setNewAppointmentTime("07:00:00"); // Mặc định 8:00 sáng
    setShowRescheduleModal(true);
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setAppointmentToReschedule(null);
    setNewAppointmentDate("");
    setNewAppointmentTime("");
  };

  // Hàm tạo các khung giờ từ 7:00 đến 17:00, cách nhau 30 phút
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 17; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      slots.push(`${hourStr}:00:00`);
      if (hour < 17) {
        slots.push(`${hourStr}:30:00`);
      }
    }
    return slots;
  };

  const handleRescheduleAppointment = async () => {
    if (!appointmentToReschedule || !newAppointmentDate || !newAppointmentTime)
      return;

    try {
      setReschedulingAppointment(true);

      // Gọi API để dời lịch hẹn
      const result = await appointmentService.rescheduleAppointment(
        appointmentToReschedule.appId,
        newAppointmentDate,
        newAppointmentTime
      );

      if (result.ok) {
        // Cập nhật state local với thông tin lịch hẹn mới
        setAppointments(
          appointments.map((app) =>
            app.appId === appointmentToReschedule.appId
              ? {
                  ...app,
                  appointmentDate: newAppointmentDate,
                  appointmentTime: newAppointmentTime,
                }
              : app
          )
        );

        // Đóng modal và hiển thị thông báo
        setShowRescheduleModal(false);
        alert("Lịch hẹn đã được dời thành công.");
      } else {
        alert(`Không thể dời lịch hẹn: ${result.message}`);
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Đã xảy ra lỗi khi dời lịch hẹn.");
    } finally {
      setReschedulingAppointment(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={handleBackHome} className="back-home-btn">
          <FaHome /> Quay lại trang chủ
        </button>
      </div>

      {/* Left Section - User Info */}
      <div className="profile-sidebar">
        <div className="user-avatar">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
            alt="User Avatar"
          />
        </div>

        <div className="user-info">
          <div className="info-item name">
            <h2>{userInfo.name}</h2>
          </div>
          <div className="info-item">
            <FaIdCard className="info-icon" />
            <span>{userInfo.id}</span>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <span>{userInfo.email}</span>
          </div>

          {isEditing ? (
            <div className="edit-form">
              <div className="edit-item">
                <FaPhone className="info-icon" />
                <input
                  type="text"
                  value={editedInfo.phone}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, phone: e.target.value })
                  }
                  placeholder="Số điện thoại"
                />
              </div>
              <div className="edit-item">
                <FaMapMarkerAlt className="info-icon" />
                <input
                  type="text"
                  value={editedInfo.address}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, address: e.target.value })
                  }
                  placeholder="Địa chỉ"
                />
              </div>
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-btn">
                  <FaSave /> Lưu
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  <FaTimes /> Hủy
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{userInfo.phone}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <span>{userInfo.address}</span>
              </div>
              <button onClick={handleEdit} className="edit-btn">
                <FaEdit /> Cập nhật hồ sơ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Section - Content */}
      <div className="profile-content">
        <div className="schedules-section">
          {selectedSchedule ? (
            <div className="schedule-detail">
              <div className="header-section">
                <button
                  className="back-btn"
                  onClick={handleCloseScheduleDetails}
                >
                  <FaArrowLeft /> Quay lại
                </button>
                <h1>Chi tiết lịch tiêm #{selectedSchedule.scheduleId}</h1>
              </div>

              {loadingScheduleDetails ? (
                <div className="loading">Đang tải dữ liệu chi tiết...</div>
              ) : (
                <>
                  <div className="schedule-summary">
                    <h2>Thông tin lịch tiêm</h2>
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span className="label">Mã lịch:</span>
                        <span className="value">
                          {selectedSchedule.scheduleId}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Trẻ em:</span>
                        <span className="value">
                          {selectedSchedule.childName}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Dịch vụ:</span>
                        <span className="value">
                          {selectedSchedule.vaccineName ||
                            selectedSchedule.packageName}
                          <span className="vaccine-type">
                            {selectedSchedule.vaccineName
                              ? " (Vắc xin)"
                              : " (Gói)"}
                          </span>
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Ngày bắt đầu:</span>
                        <span className="value">
                          {formatDate(selectedSchedule.startDate)}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Tổng số mũi:</span>
                        <span className="value">
                          {selectedSchedule.totalShot}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Trạng thái:</span>
                        <span
                          className={`status-badge ${selectedSchedule.status.toLowerCase()}`}
                        >
                          {getStatusText(selectedSchedule.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="appointments-section">
                    <h2>Danh sách lịch hẹn</h2>
                    {scheduleAppointments.length === 0 ? (
                      <div className="no-data">Không có lịch hẹn nào</div>
                    ) : (
                      <div className="appointments-cards">
                        {scheduleAppointments.map((appointment) => (
                          <div key={appointment.appId} className="history-card">
                            <div className="history-header">
                              <h3>
                                Mũi {appointment.shotNumber} -{" "}
                                {appointment.serviceName ||
                                  selectedSchedule.vaccineName ||
                                  "Không có tên"}
                              </h3>
                              <span
                                className={`status ${appointment.status.toLowerCase()}`}
                              >
                                {appointment.status === "PENDING" &&
                                  "Chờ xác nhận"}
                                {appointment.status === "CONFIRMED" &&
                                  "Đã xác nhận"}
                                {appointment.status === "COMPLETED" &&
                                  "Đã hoàn thành"}
                                {appointment.status === "CANCELLED" && "Đã hủy"}
                              </span>
                            </div>
                            <div className="history-info">
                              <div className="info-row">
                                <span>
                                  <FaIdCard className="info-icon" /> Mã cuộc
                                  hẹn: {appointment.appId}
                                </span>
                                <span>
                                  <FaCalendar className="info-icon" /> Ngày:{" "}
                                  {formatDate(appointment.appointmentDate)}
                                </span>
                              </div>
                              <div className="info-row">
                                <span>
                                  Thời gian:{" "}
                                  {formatTime(appointment.appointmentTime)}
                                </span>
                                <span>
                                  Thanh toán:{" "}
                                  {appointment.paymentStatus === "PAID"
                                    ? "Đã thanh toán"
                                    : "Chưa thanh toán"}
                                </span>
                              </div>
                              {appointment.notes && (
                                <div className="info-row notes">
                                  <span>Ghi chú: {appointment.notes}</span>
                                </div>
                              )}
                              {/* Nút đánh giá cho các lịch hẹn đã hoàn thành nhưng chưa có đánh giá */}
                              {appointment.status === "COMPLETED" &&
                                appointment.hasFeedback && (
                                  <div className="info-row feedback">
                                    <button
                                      className="feedback-btn"
                                      onClick={() =>
                                        handleFeedback(appointment)
                                      }
                                    >
                                      Đánh giá
                                    </button>
                                  </div>
                                )}
                              {appointment.status === "COMPLETED" &&
                                !appointment.hasFeedback && (
                                  <div className="info-row feedback-submitted">
                                    <span className="feedback-submitted-text">
                                      {getAppointmentFeedback(
                                        appointment.appId
                                      ) ? (
                                        <div className="rating-display">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                              key={star}
                                              className={
                                                star <=
                                                getAppointmentFeedback(
                                                  appointment.appId
                                                ).rating
                                                  ? "star-filled"
                                                  : "star-empty"
                                              }
                                            />
                                          ))}
                                          <span className="rating-text">
                                            Đã đánh giá
                                          </span>
                                        </div>
                                      ) : (
                                        <>
                                          <FaStar
                                            className="info-icon"
                                            style={{ color: "#ffc107" }}
                                          />{" "}
                                          Đã đánh giá
                                        </>
                                      )}
                                    </span>
                                  </div>
                                )}
                              \
                              {/* Nút hủy lịch hẹn nếu chưa hoàn thành và chưa hủy */}
                              {appointment.status !== "COMPLETED" &&
                                appointment.status !== "CANCELLED" && (
                                  <div className="info-row cancel">
                                    <button
                                      className="cancel-appointment-btn"
                                      onClick={() =>
                                        handleOpenCancelModal(appointment)
                                      }
                                      disabled={
                                        loadingAppointmentId ===
                                        appointment.appId
                                      }
                                    >
                                      {loadingAppointmentId ===
                                      appointment.appId
                                        ? "Đang xử lý..."
                                        : "Hủy lịch hẹn"}
                                    </button>
                                  </div>
                                )}
                              {appointment.status === "CONFIRMED" && (
                                <div className="info-row reschedule">
                                  <button
                                    className="reschedule-btn"
                                    onClick={() =>
                                      handleOpenRescheduleModal(appointment)
                                    }
                                  >
                                    Dời lịch
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="section-title">
                <h2>Danh sách lịch tiêm</h2>
              </div>

              <div className="controls">
                <div className="search-bar">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo ID, tên trẻ, vắc xin..."
                    value={scheduleSearchTerm}
                    onChange={(e) => setScheduleSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter">
                  <label>
                    <FaFilter /> Lọc theo trạng thái:
                    <select
                      value={scheduleFilterStatus}
                      onChange={(e) => setScheduleFilterStatus(e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="ACTIVE">Đang hoạt động</option>
                      <option value="COMPLETED">Đã hoàn thành</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                  </label>
                </div>
              </div>

              {loadingSchedules ? (
                <div className="loading">Đang tải danh sách lịch tiêm...</div>
              ) : (
                <div className="schedules-table-wrapper">
                  {filteredSchedules.length === 0 ? (
                    <div className="no-schedules">
                      Không tìm thấy lịch tiêm nào.
                    </div>
                  ) : (
                    <table className="schedules-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleScheduleSort("scheduleId")}>
                            Mã lịch{" "}
                            {scheduleSortField === "scheduleId" && <FaSort />}
                          </th>
                          <th onClick={() => handleScheduleSort("childName")}>
                            Trẻ em{" "}
                            {scheduleSortField === "childName" && <FaSort />}
                          </th>
                          <th>Vắc xin/Gói</th>
                          <th onClick={() => handleScheduleSort("startDate")}>
                            Ngày bắt đầu{" "}
                            {scheduleSortField === "startDate" && <FaSort />}
                          </th>
                          <th>Tổng mũi</th>
                          <th onClick={() => handleScheduleSort("status")}>
                            Trạng thái{" "}
                            {scheduleSortField === "status" && <FaSort />}
                          </th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchedules.map((schedule) => (
                          <tr key={schedule.scheduleId}>
                            <td>{schedule.scheduleId}</td>
                            <td>{schedule.childName}</td>
                            <td>
                              {schedule.vaccineName || schedule.packageName}
                              <span className="vaccine-type">
                                {schedule.vaccineName ? " (Vắc xin)" : " (Gói)"}
                              </span>
                            </td>
                            <td>{formatDate(schedule.startDate)}</td>
                            <td>{schedule.totalShot}</td>
                            <td>
                              <span
                                className={`status-badge ${schedule.status.toLowerCase()}`}
                              >
                                {schedule.status === "ACTIVE"
                                  ? "Đang hoạt động"
                                  : schedule.status === "COMPLETED"
                                  ? "Đã hoàn thành"
                                  : "Đã hủy"}
                              </span>
                            </td>
                            <td>
                              <button
                                className="view-btn"
                                onClick={() =>
                                  handleViewScheduleDetails(schedule.scheduleId)
                                }
                              >
                                <FaEye /> Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Dời lịch hẹn */}
      {showRescheduleModal && appointmentToReschedule && (
        <div className="modal-overlay">
          <div className="reschedule-modal">
            <div className="modal-header">
              <h3>Dời lịch hẹn</h3>
              <button
                className="close-btn"
                onClick={handleCloseRescheduleModal}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="appointment-info">
                <p>
                  <strong>Mã cuộc hẹn:</strong> {appointmentToReschedule.appId}
                </p>
                <p>
                  <strong>Trẻ:</strong>{" "}
                  {appointmentToReschedule.child?.fullName}
                </p>
                <p>
                  <strong>Ngày hẹn hiện tại:</strong>{" "}
                  {new Date(
                    appointmentToReschedule.appointmentDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Thời gian hiện tại:</strong>{" "}
                  {formatTime(appointmentToReschedule.appointmentTime)}
                </p>
              </div>
              <div className="reschedule-section">
                <div className="form-group">
                  <label htmlFor="newDate">Chọn ngày mới:</label>
                  <input
                    type="date"
                    id="newDate"
                    value={newAppointmentDate}
                    onChange={(e) => setNewAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Ngăn chọn ngày quá khứ
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newTime">Chọn thời gian mới:</label>
                  <select
                    id="newTime"
                    value={newAppointmentTime}
                    onChange={(e) => setNewAppointmentTime(e.target.value)}
                    required
                  >
                    {generateTimeSlots().map((timeSlot) => (
                      <option key={timeSlot} value={timeSlot}>
                        {timeSlot.substring(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={handleCloseRescheduleModal}
                disabled={reschedulingAppointment}
              >
                Hủy
              </button>
              <button
                className="confirm-btn"
                onClick={handleRescheduleAppointment}
                disabled={
                  reschedulingAppointment ||
                  !newAppointmentDate ||
                  !newAppointmentTime
                }
              >
                {reschedulingAppointment
                  ? "Đang xử lý..."
                  : "Xác nhận đổi lịch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <div className="modal-header">
              <h3>Đánh giá buổi tiêm chủng</h3>
              <button className="close-btn" onClick={handleCloseFeedback}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="appointment-info">
                <p>
                  <strong>Mã cuộc hẹn:</strong> {selectedAppointment.appId}
                </p>
                <p>
                  <strong>Trẻ:</strong> {selectedAppointment.child?.fullName}
                </p>
                <p>
                  <strong>Ngày tiêm:</strong>{" "}
                  {new Date(
                    selectedAppointment.appointmentDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Vắc-xin:</strong>{" "}
                  {selectedAppointment.vaccineId?.name}
                </p>
              </div>
              <div className="rating-section">
                <p>Đánh giá của bạn:</p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= rating ? "active" : ""}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="comment-section">
                <p>Nhận xét của bạn:</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập nhận xét của bạn..."
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={handleCloseFeedback}
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmitFeedback}
                disabled={submitting || rating === 0}
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCancelModal && appointmentToCancel && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <div className="modal-header">
              <h3>Hủy lịch hẹn</h3>
              <button
                className="close-btn"
                onClick={() => setShowCancelModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="appointment-info">
                <p>
                  <strong>Mã cuộc hẹn:</strong> {appointmentToCancel.appId}
                </p>
                <p>
                  <strong>Trẻ:</strong> {appointmentToCancel.child?.fullName}
                </p>
                <p>
                  <strong>Ngày hẹn:</strong>{" "}
                  {new Date(
                    appointmentToCancel.appointmentDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Dịch vụ:</strong> {appointmentToCancel.serviceName}
                </p>
              </div>
              <div className="reason-section">
                <p>Vui lòng chọn lý do hủy lịch hẹn:</p>
                <div className="reason-options">
                  <div className="reason-option">
                    <input
                      type="radio"
                      id="reschedule"
                      name="cancelReason"
                      value="Mong muốn dời lịch"
                      checked={cancelReason === "Mong muốn dời lịch"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="reschedule">Mong muốn dời lịch</label>
                  </div>
                  <div className="reason-option">
                    <input
                      type="radio"
                      id="wrongService"
                      name="cancelReason"
                      value="Đặt nhầm dịch vụ"
                      checked={cancelReason === "Đặt nhầm dịch vụ"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="wrongService">Đặt nhầm dịch vụ</label>
                  </div>
                  <div className="reason-option">
                    <input
                      type="radio"
                      id="wrongChild"
                      name="cancelReason"
                      value="Chọn nhầm trẻ đi tiêm"
                      checked={cancelReason === "Chọn nhầm trẻ đi tiêm"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="wrongChild">Chọn nhầm trẻ đi tiêm</label>
                  </div>
                  <div className="reason-option">
                    <input
                      type="radio"
                      id="other"
                      name="cancelReason"
                      value="Khác"
                      checked={cancelReason === "Khác"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label htmlFor="other">Khác</label>
                  </div>
                  {cancelReason === "Khác" && (
                    <textarea
                      className="other-reason"
                      placeholder="Vui lòng nhập lý do hủy lịch hẹn..."
                      rows="3"
                      onChange={(e) =>
                        setCancelReason(`Khác: ${e.target.value}`)
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowCancelModal(false)}
              >
                Đóng
              </button>
              <button
                className="confirm-btn"
                onClick={handleCancelAppointment}
                disabled={
                  !cancelReason ||
                  loadingAppointmentId === appointmentToCancel.appId
                }
              >
                {loadingAppointmentId === appointmentToCancel.appId
                  ? "Đang xử lý..."
                  : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
