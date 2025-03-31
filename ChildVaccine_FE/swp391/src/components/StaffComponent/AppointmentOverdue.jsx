import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaCalendarAlt,
  FaTimesCircle,
} from "react-icons/fa";
import appointmentService from "../../service/appointmentService";
import "../../styles/StaffStyles/AppointmentOverdue.css";

const AppointmentOverdue = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState("appointmentDate");
  const [sortDirection, setSortDirection] = useState("desc");

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("");
  const [reschedulingAppointment, setReschedulingAppointment] = useState(false);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchPastAppointments();
  }, []);

  const fetchPastAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await appointmentService.getPastAppointments();

      if (response.ok) {
        setAppointments(response.appointments || []);
      } else {
        setError(
          response.message || "Không thể tải danh sách lịch hẹn quá hạn"
        );
      }
    } catch (err) {
      setError("Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.");
      console.error("Error fetching past appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    // Xử lý các định dạng phổ biến (HH:MM:SS)
    if (timeString.includes(":")) {
      const timeParts = timeString.split(":");
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return timeString;
  };

  // Modal handlers
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

  // Hàm xử lý dời lịch (từ ScheduleDetail.jsx)
  const handleRescheduleAppointment = async () => {
    if (
      !appointmentToReschedule ||
      !newAppointmentDate ||
      !newAppointmentTime
    ) {
      // Hiển thị thông báo lỗi
      setError("Vui lòng chọn ngày và giờ mới.");
      setTimeout(() => setError(null), 3000);
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
        setSuccessMessage("Dời lịch hẹn thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(
          result.message || "Không thể dời lịch hẹn. Vui lòng thử lại sau."
        );
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      setError("Đã xảy ra lỗi khi dời lịch hẹn");
      setTimeout(() => setError(null), 3000);
    } finally {
      setReschedulingAppointment(false);
    }
  };

  const handleCancel = (appointment) => {
    // Kiểm tra các điều kiện không cho phép hủy
    if (appointment.status === "COMPLETED") {
      setWarningMessage("Không thể hủy lịch hẹn đã hoàn thành.");
      setShowWarningModal(true);
      return;
    }

    if (appointment.status === "CANCELLED") {
      setWarningMessage("Lịch hẹn này đã bị hủy trước đó.");
      setShowWarningModal(true);
      return;
    }

    // Lưu thông tin appointment cần hủy
    setPendingStatusChange({
      appointmentId: appointment.appId,
      newStatus: "CANCELLED",
    });
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    setShowConfirmModal(false);

    if (!pendingStatusChange) return;

    const { appointmentId, newStatus } = pendingStatusChange;

    try {
      // Cập nhật trạng thái appointment
      const result = await appointmentService.updateAppointmentStatus(
        appointmentId,
        newStatus
      );

      console.log("Update result:", result.ok);

      if (result && result.ok) {
        // Cập nhật UI
        setAppointments(
          appointments.map((app) =>
            app.appId === appointmentId ? { ...app, status: newStatus } : app
          )
        );

        // Hiển thị thông báo thành công
        setSuccessMessage("Hủy lịch hẹn thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result?.message || "Không thể hủy lịch hẹn. Vui lòng thử lại");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setError("Đã xảy ra lỗi khi cập nhật trạng thái lịch hẹn");
      setTimeout(() => setError(null), 3000);
    } finally {
      setPendingStatusChange(null);
    }
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      // Filter by search term
      const matchesSearch =
        appointment.appId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.scheduleId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.customerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.childName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.phoneNumber?.includes(searchTerm);

      // Filter by status
      const matchesStatus =
        filterStatus === "" || appointment.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "appId":
          comparison = a.appId.localeCompare(b.appId);
          break;
        case "customerName":
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case "childName":
          comparison = a.childName.localeCompare(b.childName);
          break;
        case "appointmentDate":
          comparison =
            new Date(a.appointmentDate) - new Date(b.appointmentDate);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="overdue-appointments-management">
      <div className="header-section">
        <h1>Danh Sách Lịch Hẹn Quá Hạn</h1>
      </div>

      <div className="controls">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên khách hàng, tên trẻ hoặc số điện thoại"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter">
          <label>
            <FaFilter /> Lọc theo trạng thái:
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="appointments-table-wrapper">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <table className="appointments-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("appId")}>
                  Mã lịch hẹn {sortField === "appId" && <FaSort />}
                </th>
                <th>Mã lịch</th>
                <th onClick={() => handleSort("customerName")}>
                  Khách hàng {sortField === "customerName" && <FaSort />}
                </th>
                <th onClick={() => handleSort("childName")}>
                  Trẻ em {sortField === "childName" && <FaSort />}
                </th>
                <th>Dịch vụ</th>
                <th>Mũi số</th>
                <th onClick={() => handleSort("status")}>
                  Trạng thái {sortField === "status" && <FaSort />}
                </th>
                <th>Thanh toán</th>
                <th onClick={() => handleSort("appointmentDate")}>
                  Ngày hẹn {sortField === "appointmentDate" && <FaSort />}
                </th>
                <th>Giờ hẹn</th>
                <th>SĐT</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.appId}>
                    <td>{appointment.appId}</td>
                    <td>{appointment.scheduleId}</td>
                    <td>{appointment.customerName}</td>
                    <td>{appointment.childName}</td>
                    <td>{appointment.serviceName}</td>
                    <td>{appointment.shotNumber}</td>
                    <td>
                      <span
                        className={`status-badge ${appointment.status.toLowerCase()}`}
                      >
                        {appointment.status === "CONFIRMED"
                          ? "Đã xác nhận"
                          : appointment.status === "PENDING"
                          ? "Chờ xác nhận"
                          : appointment.status === "COMPLETED"
                          ? "Đã hoàn thành"
                          : "Đã hủy"}
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
                    <td>
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td>{appointment.appointmentTime.substring(0, 5)}</td>
                    <td>{appointment.phoneNumber}</td>
                    <td className="action-buttons">
                      {appointment.status !== "CANCELLED" &&
                        appointment.status !== "COMPLETED" && (
                          <>
                            <button
                              className="reschedule-btn"
                              onClick={() =>
                                handleOpenRescheduleModal(appointment)
                              }
                            >
                              <FaCalendarAlt /> Dời lịch
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => handleCancel(appointment)}
                            >
                              <FaTimesCircle /> Hủy lịch
                            </button>
                          </>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="no-data">
                    Không có lịch hẹn quá hạn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reschedule Modal */}
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
                  <strong>Khách hàng:</strong>{" "}
                  {appointmentToReschedule.customerName}
                </p>
                <p>
                  <strong>Trẻ:</strong> {appointmentToReschedule.childName}
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

      {/* Modal xác nhận hủy lịch */}
      {showConfirmModal && pendingStatusChange && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Xác nhận hủy lịch</h3>
            <p>Bạn có chắc chắn muốn hủy lịch hẹn này?</p>
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
                className="close-btn"
                onClick={() => setShowWarningModal(false)}
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

export default AppointmentOverdue;
