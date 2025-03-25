import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaCalendarCheck,
  FaTimes,
  FaCheck,
  FaMoneyBillWave,
  FaNotesMedical,
  FaSave,
  FaStethoscope,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import appointmentService from "../../service/appointmentService";
import scheduleService from "../../service/scheduleService";
import recordService from "../../service/recordService";
import paymentService from "../../service/paymentService";
import style from "../../styles/StaffStyles/ScheduleDetail.css";

const ScheduleDetail = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [recordExists, setRecordExists] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [records, setRecords] = useState([]);
  const [tempRecordData, setTempRecordData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Các state mới
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [recordData, setRecordData] = useState({ symptoms: "", notes: "" });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [manualPayment, setManualPayment] = useState(false);
  // Các state cho chức năng dời lịch
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("");
  const [reschedulingAppointment, setReschedulingAppointment] = useState(false);

  // Trong useEffect khi tải dữ liệu, thêm phần tải records
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First get the schedule details
        const scheduleResponse = await scheduleService.getAllSchedules();
        if (scheduleResponse.ok) {
          const scheduleData = scheduleResponse.schedules.find(
            (s) => s.scheduleId === scheduleId
          );
          if (scheduleData) {
            setSchedule(scheduleData);

            // Chỉ gọi API kiểm tra và cập nhật trạng thái nếu schedule đang ACTIVE
            if (scheduleData.status === "ACTIVE") {
              console.log(`Kiểm tra trạng thái cho schedule ${scheduleId}`);
              const updateResult =
                await scheduleService.updateStatusIfCompleted(scheduleId);

              if (updateResult.ok && updateResult.updated) {
                console.log(
                  "Schedule đã được cập nhật trạng thái thành COMPLETED"
                );
                // Nếu schedule được cập nhật, lấy lại thông tin mới
                const refreshResponse = await scheduleService.getAllSchedules();
                if (refreshResponse.ok) {
                  const refreshedData = refreshResponse.schedules.find(
                    (s) => s.scheduleId === scheduleId
                  );
                  if (refreshedData) {
                    setSchedule(refreshedData);
                  }
                }
              }
            }
          } else {
            setError(`Không tìm thấy lịch tiêm với mã ${scheduleId}`);
          }
        }

        // Then get all appointments for this schedule
        const appointmentsResponse =
          await appointmentService.getAppointmentsByScheduleId(scheduleId);
        if (appointmentsResponse.ok) {
          const appointmentsData = appointmentsResponse.appointments || [];
          setAppointments(appointmentsData);
        } else {
          setError(
            appointmentsResponse.message || "Không thể tải danh sách lịch hẹn"
          );
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching schedule details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scheduleId]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsData = await recordService.getAllRecords();
        setRecords(recordsData);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, [refreshTrigger]);

  const hasRecord = (appointmentId) => {
    // Kiểm tra xem appointment này có record chưa
    const existingRecord = records.some(
      (record) => record.appointmentId === appointmentId
    );

    // Nếu đang xem record của appointment này (isViewOnly=true và selectedAppointmentId=appointmentId)
    // thì nghĩa là appointment này có record
    const isCurrentlyViewingThisRecord =
      isViewOnly && selectedAppointmentId === appointmentId;

    return existingRecord || isCurrentlyViewingThisRecord;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    // Handle common formats (HH:MM:SS)
    if (timeString.includes(":")) {
      const timeParts = timeString.split(":");
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return timeString;
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
      default:
        return status;
    }
  };

  const getRecordForAppointment = (appointmentId) => {
    return (
      records.find((record) => record.appointmentId === appointmentId) || {}
    );
  };

  // Xử lý khi nhấp vào nút thay đổi trạng thái
  const handleStatusChangeRequest = (appointmentId, newStatus) => {
    const appointment = appointments.find((app) => app.appId === appointmentId);

    // Kiểm tra điều kiện hợp lệ
    if (appointment.status === "COMPLETED" && newStatus === "CANCELLED") {
      setWarningMessage("Không thể hủy lịch hẹn đã hoàn thành.");
      setShowWarningModal(true);
      return;
    }

    if (appointment.status === "CANCELLED" && newStatus === "COMPLETED") {
      setWarningMessage("Không thể đánh dấu hoàn thành lịch hẹn đã hủy.");
      setShowWarningModal(true);
      return;
    }

    if (newStatus === "COMPLETED" && appointment.paymentStatus !== "PAID") {
      setWarningMessage(
        "Lịch hẹn chưa được thanh toán. Vui lòng thanh toán trước khi đánh dấu hoàn thành."
      );
      setShowWarningModal(true);
      return;
    }

    // Nếu tất cả điều kiện đều hợp lệ, hiển thị modal xác nhận
    setPendingStatusChange({ appointmentId, newStatus });
    setShowConfirmModal(true);
  };

  // Xử lý xác nhận thay đổi trạng thái
  const confirmStatusChange = async () => {
    setShowConfirmModal(false);

    if (!pendingStatusChange) return;

    const { appointmentId, newStatus } = pendingStatusChange;

    // Lấy thông tin về appointment hiện tại
    const currentAppointment = appointments.find(
      (app) => app.appId === appointmentId
    );
    if (!currentAppointment) {
      setWarningMessage("Không tìm thấy lịch hẹn.");
      setShowWarningModal(true);
      setPendingStatusChange(null);
      return;
    }

    const currentStatus = currentAppointment.status;

    // Kiểm tra logic chuyển trạng thái
    if (currentStatus === "CANCELLED" && newStatus !== "CANCELLED") {
      setWarningMessage(
        "Không thể thay đổi trạng thái từ CANCELLED sang trạng thái khác."
      );
      setShowWarningModal(true);
      setPendingStatusChange(null);
      return;
    } else if (currentStatus === "COMPLETED" && newStatus === "CONFIRMED") {
      setWarningMessage(
        "Không thể thay đổi trạng thái từ COMPLETED về CONFIRMED."
      );
      setShowWarningModal(true);
      setPendingStatusChange(null);
      return;
    }

    // Kiểm tra điều kiện thanh toán khi chuyển sang COMPLETED
    if (
      newStatus === "COMPLETED" &&
      currentAppointment.paymentStatus !== "PAID"
    ) {
      setWarningMessage(
        "Lịch hẹn chưa được thanh toán. Vui lòng thanh toán trước khi đánh dấu hoàn thành."
      );
      setShowWarningModal(true);
      setPendingStatusChange(null);
      return;
    }

    try {
      // Cập nhật trạng thái appointment
      const result = await appointmentService.updateAppointmentStatus(
        appointmentId,
        newStatus
      );
      console.log("Update appointment status result:", result);

      if (result.ok) {
        // Cập nhật state appointments
        const updatedAppointments = appointments.map((app) =>
          app.appId === appointmentId ? { ...app, status: newStatus } : app
        );

        // Cập nhật trạng thái các appointment khác nếu CANCELLED
        let finalAppointments = [...updatedAppointments];

        if (newStatus === "CANCELLED") {
          // Nếu hủy một lịch hẹn, hủy tất cả các lịch hẹn khác chưa hoàn thành
          const appointmentsToCancel = finalAppointments.filter(
            (app) =>
              app.appId !== appointmentId &&
              app.status !== "COMPLETED" &&
              app.status !== "CANCELLED"
          );

          for (const app of appointmentsToCancel) {
            await appointmentService.updateAppointmentStatus(
              app.appId,
              "CANCELLED"
            );
          }

          finalAppointments = finalAppointments.map((app) =>
            app.status !== "COMPLETED" && app.status !== "CANCELLED"
              ? { ...app, status: "CANCELLED" }
              : app
          );

          // Cập nhật schedule thành CANCELLED
          if (schedule.status !== "CANCELLED") {
            await scheduleService.updateScheduleStatus(scheduleId, "CANCELLED");
            setSchedule({ ...schedule, status: "CANCELLED" });
          }
        }

        // Cập nhật trạng thái schedule nếu appointment được đánh dấu COMPLETED
        // Sử dụng API updateStatusIfCompleted thay vì kiểm tra thủ công
        if (newStatus === "COMPLETED") {
          console.log(
            `Kiểm tra trạng thái cho schedule ${scheduleId} sau khi cập nhật appointment thành COMPLETED`
          );

          const updateResult = await scheduleService.updateStatusIfCompleted(
            scheduleId
          );

          if (updateResult.ok && updateResult.updated) {
            console.log("Schedule đã được cập nhật thành COMPLETED");
            setSchedule((prev) => ({ ...prev, status: "COMPLETED" }));
          } else {
            console.log(
              "Schedule chưa đủ điều kiện để cập nhật thành COMPLETED"
            );
          }
        }

        setAppointments(finalAppointments);

        // Hiển thị thông báo thành công
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        const errorMessage =
          result.message || "Không có thông tin lỗi chi tiết";
        console.error(`Lỗi cập nhật trạng thái: ${errorMessage}`);
        setWarningMessage(`Không thể cập nhật trạng thái: ${errorMessage}`);
        setShowWarningModal(true);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setWarningMessage("Đã xảy ra lỗi khi cập nhật trạng thái");
      setShowWarningModal(true);
    } finally {
      setPendingStatusChange(null);
    }
  };

  // Xử lý thanh toán
  const handlePaymentRequest = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    setShowPaymentModal(false);
    if (!selectedAppointment) return;

    try {
      setProcessingPayment(true);
      setProcessingPaymentId(selectedAppointment.appId);

      if (manualPayment) {
        // Thanh toán thủ công - cập nhật ngay lập tức sử dụng appointmentService
        // Chỉ truyền vào appointmentId, không cần truyền 'PAID'
        const result = await appointmentService.updatePaymentStatus(
          selectedAppointment.appId
        );
        console.log("Manual payment result:", result);
        if (result.ok) {
          // Cập nhật trạng thái trong danh sách appointments
          setAppointments(
            appointments.map((app) =>
              app.appId === selectedAppointment.appId
                ? { ...app, paymentStatus: "PAID" }
                : app
            )
          );
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } else {
          setWarningMessage(
            `Không thể cập nhật trạng thái thanh toán: ${result.message}`
          );
          setShowWarningModal(true);
        }
      } else {
        // Thanh toán qua VNPay - chỉ mở trang VNPay, không đợi kết quả
        const paymentUrl = await paymentService.createPayment(
          selectedAppointment.appId
        );
        window.open(paymentUrl, "_blank");
        // Không theo dõi việc đóng tab, để người dùng tự kiểm tra sau
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setWarningMessage("Đã xảy ra lỗi khi xử lý thanh toán");
      setShowWarningModal(true);
    } finally {
      setProcessingPayment(false);
      setProcessingPaymentId(null);
      setManualPayment(false);
      setSelectedAppointment(null);
    }
  };

  // Xử lý hiển thị modal record
  const handleRecordRequest = async (appointment) => {
    // Kiểm tra status trước khi cho phép tạo record
    if (appointment.status !== "COMPLETED") {
      setWarningMessage("Chỉ được tạo hồ sơ y tế cho lịch hẹn đã hoàn thành.");
      setShowWarningModal(true);
      return;
    }

    setSelectedAppointment(appointment);

    try {
      // Kiểm tra xem record đã tồn tại hay chưa
      const result = await recordService.getRecordByAppointmentId(
        appointment.appId
      );
      console.log("API response for record:", result);

      // Mặc định bắt đầu ở chế độ xem nếu có dữ liệu
      if (result.ok && result.record) {
        setIsViewOnly(true);
        setIsEditing(false);

        // Lưu record vào mảng nếu chưa có
        const existingRecord = records.find((r) => r.id === result.record.id);
        if (!existingRecord) {
          setRecords((prev) => [...prev, result.record]);
        }
      } else {
        // Không có record - cho phép tạo mới
        setIsViewOnly(false);
        setIsEditing(true);
      }

      // Lấy dữ liệu hiện tại (từ tempRecordData hoặc API)
      let currentRecordData;
      if (tempRecordData[appointment.appId]) {
        currentRecordData = { ...tempRecordData[appointment.appId] };
      } else if (result.ok && result.record) {
        currentRecordData = {
          symptoms: result.record.symptoms || "",
          notes: result.record.notes || "",
        };
      } else {
        currentRecordData = { symptoms: "", notes: "" };
      }

      setRecordData(currentRecordData);
      setShowRecordModal(true);
    } catch (error) {
      console.error("Error checking record:", error);
      setWarningMessage(
        "Không thể kiểm tra thông tin hồ sơ y tế. Vui lòng thử lại sau."
      );
      setShowWarningModal(true);
    }
  };

  const handleEditRecord = () => {
    setIsViewOnly(false);
    setIsEditing(true);
  };

  // Xử lý lưu record
  const handleSaveRecord = async () => {
    // Nếu đang ở chế độ chỉ xem, không cần xử lý gì
    if (isViewOnly) {
      setShowRecordModal(false);
      return;
    }

    if (!selectedAppointment || !recordData.symptoms.trim()) {
      setWarningMessage("Vui lòng nhập triệu chứng sau tiêm");
      setShowWarningModal(true);
      return;
    }

    try {
      setIsSaving(true);

      // Tạo đối tượng record mới - đúng theo cấu trúc từ AppointmentInfo
      const recordToSend = {
        appointmentId: selectedAppointment.appId,
        staffId: "S001", // Dùng S001 giống như trong AppointmentInfo
        symptoms: recordData.symptoms,
        notes: recordData.notes,
        appointmentDate: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
      };

      console.log("Dữ liệu record gửi đi:", recordToSend);

      // Gọi API để lưu record - sử dụng createRecord trong recordService
      const savedRecord = await recordService.createRecord(recordToSend);

      console.log("Kết quả từ API:", savedRecord);

      if (savedRecord && savedRecord.id) {
        // Cập nhật state records
        setRecords((prevRecords) => [...prevRecords, savedRecord]);

        // Xóa dữ liệu tạm thời vì đã lưu thành công
        setTempRecordData((prev) => {
          const updated = { ...prev };
          delete updated[selectedAppointment.appId];
          return updated;
        });

        // Thêm delay nhỏ trước khi đóng modal - giúp UX tốt hơn
        setTimeout(() => {
          setShowRecordModal(false);
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }, 100);
      } else {
        setWarningMessage(
          "Lưu record không thành công. Dữ liệu trả về không hợp lệ."
        );
        setShowWarningModal(true);
      }
    } catch (error) {
      console.error("Error saving record:", error);
      setWarningMessage(
        error.message || "Không thể lưu dữ liệu. Vui lòng thử lại sau."
      );
      setShowWarningModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Thêm hàm xử lý đóng modal record
  const handleCloseRecordModal = () => {
    console.log("Đóng modal, giữ dữ liệu tạm:", tempRecordData);
    // Chỉ ẩn modal nhưng không reset selectedAppointment hoặc dữ liệu
    setShowRecordModal(false);

    // KHÔNG làm điều này:
    // setSelectedAppointment(null);
    // setRecordData({ symptoms: "", notes: "" });
  };

  // Hàm tạo các slot thời gian từ 8h đến 17h
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, "0")}:30:00`);
      }
    }
    return slots;
  };

  // Hàm mở modal dời lịch
  const handleOpenRescheduleModal = (appointment) => {
    setAppointmentToReschedule(appointment);
    setNewAppointmentDate("");
    setNewAppointmentTime("");
    setShowRescheduleModal(true);
  };

  // Hàm đóng modal dời lịch
  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setAppointmentToReschedule(null);
    setNewAppointmentDate("");
    setNewAppointmentTime("");
  };

  // Hàm xử lý dời lịch
  const handleRescheduleAppointment = async () => {
    if (
      !appointmentToReschedule ||
      !newAppointmentDate ||
      !newAppointmentTime
    ) {
      setWarningMessage("Vui lòng chọn ngày và giờ mới.");
      setShowWarningModal(true);
      return;
    }

    try {
      setReschedulingAppointment(true);

      // Gọi API để cập nhật lịch hẹn
      const result = await appointmentService.rescheduleAppointment(
        appointmentToReschedule.appId,
        newAppointmentDate,
        newAppointmentTime
      );

      if (result.ok) {
        // Cập nhật state appointments
        const updatedAppointments = appointments.map((app) =>
          app.appId === appointmentToReschedule.appId
            ? {
                ...app,
                appointmentDate: newAppointmentDate,
                appointmentTime: newAppointmentTime,
              }
            : app
        );
        setAppointments(updatedAppointments);

        // Đóng modal và hiển thị thông báo thành công
        handleCloseRescheduleModal();
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        setWarningMessage(
          result.message || "Không thể dời lịch hẹn. Vui lòng thử lại sau."
        );
        setShowWarningModal(true);
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      setWarningMessage("Đã xảy ra lỗi khi dời lịch hẹn");
      setShowWarningModal(true);
    } finally {
      setReschedulingAppointment(false);
    }
  };
  return (
    <div className="schedule-detail">
      <div className="header-section">
        <button
          className="back-btn"
          onClick={() => navigate("/staff/schedule-info")}
        >
          <FaArrowLeft /> Quay lại
        </button>
        <h1>Chi tiết lịch tiêm #{scheduleId}</h1>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          Thao tác đã được thực hiện thành công!
        </div>
      )}

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {schedule && (
            <div className="schedule-summary">
              <h2>Thông tin lịch tiêm</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Mã lịch:</span>
                  <span className="value">{schedule.scheduleId}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Khách hàng:</span>
                  <span className="value">
                    {schedule.cusName} ({schedule.cusId})
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Trẻ em:</span>
                  <span className="value">{schedule.childName}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Dịch vụ:</span>
                  <span className="value">
                    {schedule.vaccineName || schedule.packageName}
                    <span className="vaccine-type">
                      {schedule.vaccineName ? " (Vắc xin)" : " (Gói)"}
                    </span>
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Ngày bắt đầu:</span>
                  <span className="value">
                    {formatDate(schedule.startDate)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Tổng số mũi:</span>
                  <span className="value">{schedule.totalShot}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Trạng thái:</span>
                  <span
                    className={`status-badge ${schedule.status.toLowerCase()}`}
                  >
                    {schedule.status === "ACTIVE"
                      ? "Đang hoạt động"
                      : schedule.status === "COMPLETED"
                      ? "Đã hoàn thành"
                      : "Đã hủy"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="appointments-section">
            <h2>Danh sách lịch hẹn</h2>
            {appointments.length === 0 ? (
              <div className="no-data">Không có lịch hẹn nào</div>
            ) : (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Mã hẹn</th>
                    <th>Mũi số</th>
                    <th>Vắc xin</th>
                    <th>Ngày hẹn</th>
                    <th>Giờ hẹn</th>
                    <th>Trạng thái</th>
                    <th>Thanh toán</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.appId}
                      className={
                        processingPaymentId === appointment.appId
                          ? "processing-payment"
                          : ""
                      }
                    >
                      <td>{appointment.appId}</td>
                      <td className="shot-number">
                        Mũi {appointment.shotNumber}
                      </td>
                      <td>{appointment.serviceName || "-"}</td>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{formatTime(appointment.appointmentTime)}</td>
                      <td>
                        <span
                          className={getStatusBadgeClass(appointment.status)}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`payment-status ${appointment.paymentStatus.toLowerCase()}`}
                        >
                          {appointment.paymentStatus === "PAID"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="action-buttons">
                        {/* Nút thanh toán */}
                        {appointment.status !== "CANCELLED" &&
                          appointment.paymentStatus !== "PAID" && (
                            <button
                              className="payment-btn"
                              onClick={() => handlePaymentRequest(appointment)}
                              disabled={processingPayment}
                              title="Thanh toán"
                            >
                              <FaMoneyBillWave />
                            </button>
                          )}

                        {/* Nút tạo hồ sơ y tế */}
                        {appointment.status === "COMPLETED" && (
                          <button
                            className="record-btn"
                            onClick={() => handleRecordRequest(appointment)}
                            title={
                              hasRecord(appointment.appId)
                                ? "Xem hồ sơ y tế"
                                : "Tạo hồ sơ y tế"
                            }
                            // Thêm biểu tượng khác nhau cho xem và tạo mới
                            aria-label={
                              hasRecord(appointment.appId)
                                ? "Xem hồ sơ y tế"
                                : "Tạo hồ sơ y tế"
                            }
                          >
                            {hasRecord(appointment.appId) ? (
                              <FaEye />
                            ) : (
                              <FaNotesMedical />
                            )}
                          </button>
                        )}
                        {appointment.status === "CONFIRMED" && (
                          <button
                            className="reschedule-btn"
                            onClick={() =>
                              handleOpenRescheduleModal(appointment)
                            }
                            title="Dời lịch hẹn"
                          >
                            <FaCalendarAlt />
                          </button>
                        )}

                        {/* Nút thay đổi trạng thái */}
                        {appointment.status !== "COMPLETED" &&
                          appointment.status !== "CANCELLED" && (
                            <>
                              <button
                                className="cancel-btn"
                                onClick={() =>
                                  handleStatusChangeRequest(
                                    appointment.appId,
                                    "CANCELLED"
                                  )
                                }
                                title="Hủy lịch hẹn"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Modal xác nhận thay đổi trạng thái */}
      {showConfirmModal && pendingStatusChange && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Xác nhận thay đổi</h3>
            <p>
              {pendingStatusChange.newStatus === "COMPLETED"
                ? "Bạn có chắc muốn đánh dấu lịch hẹn này là đã hoàn thành?"
                : "Bạn có chắc muốn hủy lịch hẹn này?"}
            </p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmStatusChange}>
                Xác nhận
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cảnh báo */}
      {showWarningModal && (
        <div className="modal-overlay">
          <div className="warning-modal">
            <h3>Cảnh báo</h3>
            <p>{warningMessage}</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowWarningModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thanh toán */}
      {showPaymentModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <h3>Thanh toán</h3>
            <p>
              Chọn phương thức thanh toán cho lịch hẹn #
              {selectedAppointment.appId}
            </p>

            <div className="payment-options">
              <div className="payment-option">
                <input
                  type="radio"
                  id="vnpay"
                  name="paymentMethod"
                  checked={!manualPayment}
                  onChange={() => setManualPayment(false)}
                />
                <label htmlFor="vnpay">Thanh toán qua VNPay</label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="manual"
                  name="paymentMethod"
                  checked={manualPayment}
                  onChange={() => setManualPayment(true)}
                />
                <label htmlFor="manual">Đánh dấu đã thanh toán thủ công</label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={processPayment}
                disabled={processingPayment}
              >
                {processingPayment ? "Đang xử lý..." : "Tiếp tục"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal record */}
      {showRecordModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="record-modal">
            <h3>
              {isViewOnly
                ? "Xem hồ sơ y tế"
                : hasRecord(selectedAppointment.appId)
                ? "Chỉnh sửa hồ sơ y tế"
                : "Tạo hồ sơ y tế"}
            </h3>
            <div className="modal-info">
              <div className="info-item">
                <span className="info-label">Mã cuộc hẹn:</span>
                <span className="info-value">{selectedAppointment.appId}</span>
              </div>
              {/* Các info item khác không đổi */}
            </div>

            <div className="form-group">
              <label htmlFor="symptoms">
                <FaStethoscope /> Triệu chứng:
              </label>
              <textarea
                id="symptoms"
                value={recordData.symptoms}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setRecordData({ ...recordData, symptoms: newValue });

                  // Lưu vào dữ liệu tạm thời
                  setTempRecordData((prev) => ({
                    ...prev,
                    [selectedAppointment.appId]: {
                      ...prev[selectedAppointment.appId],
                      symptoms: newValue,
                    },
                  }));
                }}
                placeholder="Nhập triệu chứng sau tiêm..."
                disabled={isViewOnly}
                readOnly={isViewOnly}
                className={isViewOnly ? "readonly" : ""}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">
                <FaNotesMedical /> Ghi chú:
              </label>
              <textarea
                id="symptoms"
                value={recordData.notes}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setRecordData({ ...recordData, notes: newValue });

                  // Lưu vào dữ liệu tạm thời
                  setTempRecordData((prev) => ({
                    ...prev,
                    [selectedAppointment.appId]: {
                      ...prev[selectedAppointment.appId],
                      notes: newValue,
                    },
                  }));
                }}
                placeholder="Nhập ghi chú sau tiêm..."
                disabled={isViewOnly}
                readOnly={isViewOnly}
                className={isViewOnly ? "readonly" : ""}
                required
              />
            </div>

            {/* Phần notes tương tự */}

            <div className="modal-actions">
              {isViewOnly ? (
                <>
                  <button className="edit-btn" onClick={handleEditRecord}>
                    <FaEdit /> Chỉnh sửa
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleCloseRecordModal}
                  >
                    Đóng
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="save-btn"
                    onClick={handleSaveRecord}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      "Đang lưu..."
                    ) : (
                      <>
                        <FaSave /> Lưu
                      </>
                    )}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleCloseRecordModal}
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal dời lịch */}
      {showRescheduleModal && appointmentToReschedule && (
        <div className="modal-overlay">
          <div className="reschedule-modal">
            <h3>Dời lịch hẹn</h3>
            <div className="modal-content">
              <div className="appointment-info">
                <p>
                  <strong>Mã cuộc hẹn:</strong> {appointmentToReschedule.appId}
                </p>
                <p>
                  <strong>Trẻ:</strong> {schedule?.childName}
                </p>
                <p>
                  <strong>Ngày hẹn hiện tại:</strong>{" "}
                  {formatDate(appointmentToReschedule.appointmentDate)}
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
                    min={new Date().toISOString().split("T")[0]}
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
                    <option value="">-- Chọn thời gian --</option>
                    {generateTimeSlots().map((timeSlot) => (
                      <option key={timeSlot} value={timeSlot}>
                        {timeSlot.substring(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-actions">
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
    </div>
  );
};

export default ScheduleDetail;
