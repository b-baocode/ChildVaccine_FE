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
  // Thêm state mới
  const [customerFeedbacks, setCustomerFeedbacks] = useState([]);
  const [showViewFeedbackModal, setShowViewFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Thêm state mới vào các state hiện có
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
          try {
            const appointmentsData =
              await appointmentService.getAppointmentsByCustomerId(
                sessionData.body.cusId
              );

            // Kiểm tra dữ liệu trả về
            if (Array.isArray(appointmentsData)) {
              setAppointments(appointmentsData);
            } else {
              console.warn("Không tìm thấy lịch hẹn hoặc dữ liệu không hợp lệ");
              setAppointments([]); // Khởi tạo mảng rỗng để tránh lỗi
            }
          } catch (error) {
            console.error("Error fetching appointments:", error);
            setAppointments([]); // Khởi tạo mảng rỗng nếu có lỗi
          } finally {
            setLoadingAppointments(false);
          }

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
        const sessionData = await sessionService.checkSession();

        // Lấy danh sách các lịch hẹn đã COMPLETED nhưng chưa có đánh giá
        const pendingData =
          await appointmentService.getCompletedAppointmentsWithoutFeedback(
            sessionData.body.cusId
          );
        setPendingFeedbackAppointments(pendingData || []);
        console.log("Pending feedback appointments:", pendingData);

        // Lấy danh sách các đánh giá đã có cho các lịch hẹn đã hoàn thành
        const completedAppointments = appointments.filter(
          (a) => a.status === "COMPLETED"
        );

        if (completedAppointments.length > 0) {
          // Sử dụng Promise.all để gọi API đồng thời
          const feedbackPromises = completedAppointments.map((app) =>
            feedbackService
              .getFeedbackByAppointmentId(app.appId)
              .then((feedback) => ({ appId: app.appId, feedback }))
              .catch(() => ({ appId: app.appId, feedback: null }))
          );

          const results = await Promise.all(feedbackPromises);

          // Tạo map từ kết quả
          const feedbacksMap = {};
          results.forEach((result) => {
            if (result.feedback) {
              feedbacksMap[result.appId] = result.feedback;
            }
          });

          setAppointmentFeedbacks(feedbacksMap);
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    if (appointments.length > 0) {
      fetchFeedbackData();
    }
  }, [appointments]);

  // Thêm useEffect này sau useEffect hiện tại
  useEffect(() => {
    const fetchCustomerFeedbacks = async () => {
      try {
        const sessionData = await sessionService.checkSession();
        if (sessionData) {
          const feedbacks = await feedbackService.getFeedbacksByCustomerId(
            sessionData.body.cusId
          );
          setCustomerFeedbacks(Array.isArray(feedbacks) ? feedbacks : []);
          console.log("Tất cả feedbacks của khách hàng:", feedbacks);
        }
      } catch (error) {
        console.error("Error fetching customer feedbacks:", error);
      }
    };

    fetchCustomerFeedbacks();
  }, []);

  const handleFeedback = (appointment) => {
    console.log("Feedback for appointment:", appointment);
    if (!needsFeedback(appointment.appId)) {
      return;
    }
    setSelectedAppointment(appointment);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      setSubmitting(true);

      const currentDate = new Date().toISOString();
      const feedbackData = {
        appointmentId: selectedAppointment.appId,
        rating: rating,
        feedback: comment.trim(),
        createdDate: currentDate, // Thêm ngày tạo feedback
      };

      await feedbackService.submitFeedback(feedbackData);

      // Cập nhật trạng thái feedback localy
      setAppointmentFeedbacks({
        ...appointmentFeedbacks,
        [selectedAppointment.appId]: {
          appointmentId: selectedAppointment.appId,
          rating: rating,
          feedback: comment.trim(),
          createdDate: new Date().toISOString(),
        },
      });

      const result = await feedbackService.submitFeedback(feedbackData);

      // Tạo đối tượng feedback đầy đủ để cập nhật UI
      const newFeedback = {
        id: result?.id || `temp-${Date.now()}`,
        appointmentId: selectedAppointment.appId,
        rating: rating,
        feedbackText: comment.trim(),
        createdDate: currentDate,
        appointmentDate: selectedAppointment.appointmentDate,
      };

      // Cập nhật cả hai state để đảm bảo hiển thị nhất quán
      setAppointmentFeedbacks({
        ...appointmentFeedbacks,
        [selectedAppointment.appId]: newFeedback,
      });

      // Loại bỏ appointment này khỏi danh sách chờ đánh giá
      setPendingFeedbackAppointments(
        pendingFeedbackAppointments.filter(
          (app) => app.appId !== selectedAppointment.appId
        )
      );

      setShowFeedbackModal(false);
      setSelectedAppointment(null);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Không thể gửi đánh giá. Vui lòng thử lại sau.");
      setShowErrorModal(true);
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

  // Kiểm tra xem appointment có cần đánh giá không
  const needsFeedback = (appointmentId) => {
    // Kiểm tra xem appointment có trong danh sách chờ đánh giá không
    return pendingFeedbackAppointments.some(
      (app) => app.appId === appointmentId
    );
  };

  // Kiểm tra xem appointment đã có đánh giá chưa
  const hasFeedback = (appointmentId) => {
    // Kiểm tra xem appointment đã có feedback trong map chưa
    return (
      !!appointmentFeedbacks[appointmentId] ||
      customerFeedbacks.some((fb) => fb.appointmentId === appointmentId)
    );
  };

  // Cập nhật hàm này để kiểm tra cả hai nguồn dữ liệu và xử lý trường hợp null
  const getAppointmentFeedback = (appointmentId) => {
    // Kiểm tra trong appointmentFeedbacks trước
    let feedback = appointmentFeedbacks[appointmentId];

    // Nếu không có, tìm trong customerFeedbacks
    if (!feedback) {
      feedback = customerFeedbacks.find(
        (fb) => fb.appointmentId === appointmentId
      );
    }

    return feedback || { rating: 0 }; // Return default object với rating 0 nếu không tìm thấy
  };

  const handleViewFeedback = (appointmentId) => {
    // Ưu tiên lấy từ appointmentFeedbacks (đã được load trước đó)
    const feedback = appointmentFeedbacks[appointmentId];

    // Nếu không tìm thấy, thử tìm trong customerFeedbacks
    if (!feedback) {
      const fbFromList = customerFeedbacks.find(
        (fb) => fb.appointmentId === appointmentId
      );
      if (fbFromList) {
        setSelectedFeedback(fbFromList);
        setShowViewFeedbackModal(true);
        return;
      }
      setErrorMessage("Không tìm thấy thông tin đánh giá cho cuộc hẹn này.");
      setShowErrorModal(true);
      return;
    }

    setSelectedFeedback(feedback);
    setShowViewFeedbackModal(true);
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
    if (!editedInfo.phone || !editedInfo.address) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
      setShowErrorModal(true);
      return;
    }

    try {
      setUpdatingProfile(true);

      // Tạo đối tượng dữ liệu cập nhật
      const updateData = {
        phone: editedInfo.phone,
        address: editedInfo.address,
      };

      // Gọi API cập nhật thông tin
      const result = await customerService.updateCustomerProfile(
        userInfo.id,
        updateData
      );

      if (result.ok) {
        // Cập nhật state với thông tin mới
        setUserInfo((prev) => ({
          ...prev,
          phone: editedInfo.phone,
          address: editedInfo.address,
        }));

        // Hiển thị thông báo thành công
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);

        // Thoát chế độ chỉnh sửa
        setIsEditing(false);
      } else {
        // Hiển thị thông báo lỗi
        setErrorMessage(
          result.message || "Không thể cập nhật thông tin. Vui lòng thử lại."
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Đã xảy ra lỗi khi cập nhật thông tin.");
      setShowErrorModal(true);
    } finally {
      setUpdatingProfile(false);
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
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setErrorMessage("Không thể hủy cuộc hẹn. Vui lòng thử lại sau.");
      setShowErrorModal(true);
    } finally {
      setLoadingAppointmentId(null);
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
        setErrorMessage("Không thể tải danh sách cuộc hẹn cho lịch tiêm này.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error loading schedule details:", error);
      setErrorMessage("Đã xảy ra lỗi khi tải chi tiết lịch tiêm.");
      setShowErrorModal(true);
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
    setNewAppointmentDate(appointment.appointmentDate);
    setNewAppointmentTime(appointment.appointmentTime || "07:00:00");
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
      } else {
        setErrorMessage(`Không thể dời lịch hẹn: ${result.message}`);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      setErrorMessage("Đã xảy ra lỗi khi dời lịch hẹn.");
      setShowErrorModal(true);
    } finally {
      setReschedulingAppointment(false);
    }
  };

  const calculateDateRange = (baseDate) => {
    if (!baseDate) return { min: null, max: null };

    const date = new Date(baseDate);

    // Tính 3 ngày trước
    const minDate = new Date(date);
    minDate.setDate(date.getDate() - 3);

    // Tính 3 ngày sau
    const maxDate = new Date(date);
    maxDate.setDate(date.getDate() + 3);

    // Đảm bảo không chọn ngày quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      min:
        minDate < today
          ? today.toISOString().split("T")[0]
          : minDate.toISOString().split("T")[0],
      max: maxDate.toISOString().split("T")[0],
    };
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {updateSuccess && (
          <div className="success-message">
            <FaCheck /> Cập nhật thông tin thành công!
          </div>
        )}

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
                  disabled={updatingProfile}
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
                  disabled={updatingProfile}
                />
              </div>
              <div className="edit-buttons">
                <button
                  onClick={handleSave}
                  className="save-btn"
                  disabled={updatingProfile}
                >
                  {updatingProfile ? (
                    <>Đang cập nhật...</>
                  ) : (
                    <>
                      <FaSave /> Lưu
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="cancel-btn"
                  disabled={updatingProfile}
                >
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
                                needsFeedback(appointment.appId) && (
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
                                hasFeedback(appointment.appId) && (
                                  <div className="info-row feedback-submitted">
                                    <span className="feedback-submitted-text">
                                      <div className="rating-display">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                          // Lấy feedback và xử lý an toàn
                                          const feedback =
                                            getAppointmentFeedback(
                                              appointment.appId
                                            );
                                          const rating = feedback
                                            ? feedback.rating
                                            : 0;

                                          return (
                                            <FaStar
                                              key={star}
                                              className={
                                                star <= rating
                                                  ? "star-filled"
                                                  : "star-empty"
                                              }
                                            />
                                          );
                                        })}
                                        <button
                                          className="view-feedback-btn"
                                          onClick={() =>
                                            handleViewFeedback(
                                              appointment.appId
                                            )
                                          }
                                        >
                                          Xem chi tiết
                                        </button>
                                      </div>
                                    </span>
                                  </div>
                                )}

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
                                    className="profile-reschedule-btn"
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
                    min={
                      calculateDateRange(
                        appointmentToReschedule.appointmentDate
                      ).min
                    }
                    max={
                      calculateDateRange(
                        appointmentToReschedule.appointmentDate
                      ).max
                    }
                    required
                  />
                  <small className="date-range-info">
                    (Bạn chỉ có thể chọn trong phạm vi 3 ngày trước và sau ngày
                    hẹn ban đầu)
                  </small>
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

      {/* Modal xem đánh giá */}
      {showViewFeedbackModal && selectedFeedback && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <div className="modal-header">
              <h3>Chi tiết đánh giá</h3>
              <button
                className="close-btn"
                onClick={() => setShowViewFeedbackModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="appointment-info">
                <p>
                  <strong>Mã cuộc hẹn:</strong> {selectedFeedback.appointmentId}
                </p>
                <p>
                  <strong>Ngày tiêm:</strong>{" "}
                  {formatDate(selectedFeedback.appointmentDate)}
                </p>
                <p>
                  <strong>Ngày đánh giá:</strong>{" "}
                  {formatDate(selectedFeedback.createdDate)}
                </p>
              </div>
              <div className="rating-section">
                <p>Đánh giá của bạn:</p>
                <div className="star-rating-view">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= selectedFeedback.rating
                          ? "star-filled"
                          : "star-empty"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="comment-section">
                <p>Nhận xét của bạn:</p>
                <div className="feedback-text">
                  {selectedFeedback.feedbackText ||
                    selectedFeedback.feedback ||
                    "(Không có nhận xét)"}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="close-btn"
                onClick={() => setShowViewFeedbackModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="error-modal">
            <div className="modal-header">
              <h3>Có lỗi xảy ra</h3>
              <button
                className="close-btn"
                onClick={() => setShowErrorModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="error-icon">
                <FaTimes />
              </div>
              <p className="error-message">{errorMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                className="close-btn"
                onClick={() => setShowErrorModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
