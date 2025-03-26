import React, { useEffect, useState } from "react";
import appointmentService from "../../service/appointmentService"; // Điều chỉnh đường dẫn nếu cần
import "../../styles/StaffStyles/Appointments.css";
import recordService from "../../service/recordService";
import paymentService from "../../service/paymentService"; // Import paymentService
import sessionService from "../../service/sessionService";

const StaffAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("CONFIRMED");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false); // Thêm state cho warningModal
  const [warningMessage, setWarningMessage] = useState(""); // Lưu thông báo lỗi
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  const [records, setRecords] = useState([]);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsData = await appointmentService.getAllAppointments();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && showUpdateModal) {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [showUpdateModal]);

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

  const getRecordForAppointment = (appointmentId) => {
    return (
      records.find((record) => record.appointmentId === appointmentId) || {}
    );
  };

  const handleOverlayClick = (event) => {
    if (event.target.className === "update-modal-overlay") {
      handleCloseModal();
    }
  };

  const handleUpdateClick = (appointment) => {
    setSelectedAppointmentId(appointment.appId);

    const record = getRecordForAppointment(appointment.appId);

    if (record.id) {
      // Record exists - set values from record and mark as view-only
      setSymptoms(record.symptoms || "");
      setNotes(record.notes || "");
      setIsViewOnly(true); // New state variable
    } else {
      // No record - allow creation
      setSymptoms("");
      setNotes("");
      setIsViewOnly(false);
    }

    setStatus(appointment.status);
    setShowUpdateModal(true);
  };

  const handleSaveClick = async (appointmentId) => {
    try {
      setIsSaving(true);

      // Tạo đối tượng record mới
      const recordData = {
        appointmentId: appointmentId,
        staffId: "S001",
        symptoms: symptoms,
        notes: notes,
        appointmentDate: new Date().toISOString().split("T")[0],
      };

      // Gọi API để lưu record
      const savedRecord = await recordService.createRecord(recordData);

      if (savedRecord && savedRecord.id) {
        // Cập nhật state records
        const newRecords = [...records, savedRecord];
        setRecords(newRecords);

        // Cập nhật state appointments
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.appId === appointmentId
              ? { ...appointment, notes: notes }
              : appointment
          )
        );

        // QUAN TRỌNG: Thêm một chút trễ trước khi đóng modal
        // Để đảm bảo state đã được cập nhật trước khi re-render
        setTimeout(() => {
          // Hiển thị thông báo thành công
          setShowSuccessMessage(true);

          // Đóng modal
          setShowUpdateModal(false);

          // Ẩn thông báo sau một khoảng thời gian
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }, 100); // Đợi 100ms để đảm bảo state đã được cập nhật

        if (savedRecord && savedRecord.id) {
          setRecords((prevRecords) => [...prevRecords, savedRecord]);
          setRefreshTrigger((prev) => prev + 1);
        }
      } else {
        setError("Lưu record không thành công. Dữ liệu trả về không hợp lệ.");
      }
    } catch (error) {
      console.error("Error saving record:", error);
      setError(error.message || "Không thể lưu dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    const currentAppointment = appointments.find(
      (appt) => appt.appId === appointmentId
    );
    const currentStatus = currentAppointment.status;

    // Kiểm tra logic trước khi hiển thị modal
    if (currentStatus === "CANCELLED" && newStatus !== "CANCELLED") {
      setWarningMessage(
        "Không thể thay đổi trạng thái từ CANCELLED sang trạng thái khác."
      );
      setShowWarningModal(true);
    } else if (currentStatus === "COMPLETED" && newStatus === "CONFIRMED") {
      setWarningMessage(
        "Không thể thay đổi trạng thái từ COMPLETED về CONFIRMED."
      );
      setShowWarningModal(true);
    } else {
      setPendingStatusChange({ appointmentId, newStatus });
      setShowConfirmModal(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { appointmentId, newStatus } = pendingStatusChange;

    try {
      const updatedAppointment =
        await appointmentService.updateAppointmentStatus(
          appointmentId,
          newStatus.toUpperCase()
        );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appId === appointmentId ? updatedAppointment : appointment
        )
      );

      setShowConfirmModal(false);
      setPendingStatusChange(null);

      // Hiển thị thông báo cập nhật thành công
      alert(`Trạng thái đã được cập nhật thành ${newStatus.toUpperCase()}!`);

      // Nếu status là COMPLETED, có thể phát sự kiện qua WebSocket (nếu cần)
      if (newStatus.toUpperCase() === "COMPLETED") {
        console.log(
          "🔔 Appointment completed, feedback required:",
          appointmentId
        );
        // Gửi event socket ở đây nếu hệ thống hỗ trợ
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert(
        error.message ||
          "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại!"
      );
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedAppointmentId(null);
    setSymptoms("");
    setNotes("");
    setStatus("CONFIRMED");
    setIsViewOnly(false);
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
    setWarningMessage("");
  };

  const getServiceId = (appointment) => {
    if (appointment.vaccineId && typeof appointment.vaccineId === "object") {
      return appointment.vaccineId.vaccineId;
    }
    if (appointment.packageId && typeof appointment.packageId === "object") {
      return appointment.packageId.packageId;
    }
    return "N/A";
  };
  // Add this function after the other handler functions
  const handlePayment = async (appointment) => {
    try {
      setProcessingPayment(true);
      setProcessingPaymentId(appointment.appId);

      // Import paymentService at the top of the file
      // import paymentService from '../../service/paymentService';
      sessionStorage.setItem("currentPaymentAppId", appointment.appId);

      // Get payment URL from API
      const paymentUrl = await paymentService.createPayment(appointment.appId);

      // Open VNPay payment page in a new tab
      const newTab = window.open(paymentUrl, "_blank");

      // Check if popup was blocked
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        alert(
          "Trình duyệt đã chặn cửa sổ thanh toán. Vui lòng cho phép popup và thử lại."
        );
        setProcessingPayment(false);
        setProcessingPaymentId(null);
        return;
      }

      // Thiết lập một interval để kiểm tra xem cửa sổ thanh toán đã đóng chưa
      const checkPaymentCompletionInterval = setInterval(() => {
        if (newTab.closed) {
          clearInterval(checkPaymentCompletionInterval);

          // Kiểm tra kết quả thanh toán thông qua API
          checkPaymentStatus(appointment.appId);

          // Reset processing state
          setProcessingPayment(false);
          setProcessingPaymentId(null);
        }
      }, 1000);
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Không thể khởi tạo thanh toán. Vui lòng thử lại sau.");
      setProcessingPayment(false);
      setProcessingPaymentId(null);
    }
  };

  // Hàm mới để kiểm tra trạng thái thanh toán
  const checkPaymentStatus = async (appointmentId) => {
    try {
      // Lấy thông tin appointment mới nhất để kiểm tra trạng thái
      const updatedAppointment = await appointmentService.getAppointmentById(
        appointmentId
      );

      // Nếu trạng thái thanh toán đã chuyển thành PAID, reload trang
      if (updatedAppointment && updatedAppointment.paymentStatus === "PAID") {
        console.log("Thanh toán thành công, đang làm mới trang...");

        // Hiển thị thông báo thành công
        setShowSuccessMessage(true);
        setTimeout(() => {
          window.location.reload(); // Reload trang
        }, 1500); // Đợi 1.5 giây để người dùng thấy thông báo
      } else {
        // Nếu chưa thành công, hiển thị thông báo tương ứng
        console.log(
          "Trạng thái thanh toán chưa được cập nhật hoặc không thành công"
        );

        // Cập nhật lại danh sách appointments để hiển thị trạng thái mới nhất
        setAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app.appId === appointmentId ? updatedAppointment : app
          )
        );
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  return (
    <div className="appointment-page">
      <h1>Appointments</h1>
      {showSuccessMessage && (
        <div className="success-message">Cập nhật thông tin thành công!</div>
      )}
      {error && <div className="error-message">{error}</div>}
      <table className="appointment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Child ID</th>
            <th>Service ID</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Notes</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments
            .sort((a, b) => {
              const numA = parseInt(a.appId.substring(3), 10) || 0;
              const numB = parseInt(b.appId.substring(3), 10) || 0;
              return numB - numA;
            })
            .map((appointment) => {
              const appointmentRecord = getRecordForAppointment(
                appointment.appId
              );
              const hasExistingRecord = hasRecord(appointment.appId);

              return (
                <tr key={appointment.appId}>
                  <td>{appointment.appId}</td>
                  <td>{appointment.customer?.cusId || "N/A"}</td>
                  <td>{appointment.child?.childId || "N/A"}</td>
                  <td>
                    {appointment.vaccineId?.name ||
                      appointment.packageId?.name ||
                      "N/A"}
                  </td>
                  <td>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </td>
                  <td>{appointment.appointmentTime}</td>
                  <td>
                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        handleStatusChange(appointment.appId, e.target.value)
                      }
                      className={`status-select ${appointment.status.toLowerCase()}`}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td
                    className={`payment-status ${appointment.paymentStatus.toLowerCase()}`}
                  >
                    {appointment.paymentStatus}
                  </td>
                  <td>
                    {hasExistingRecord
                      ? appointmentRecord.notes
                      : appointment.notes || ""}
                  </td>

                  <td>
                    {hasExistingRecord ? (
                      // Nếu đã có record, luôn hiển thị nút View
                      <button
                        className="view-btn"
                        onClick={() => handleUpdateClick(appointment)}
                      >
                        View
                      </button>
                    ) : appointment.status === "CANCELLED" ? (
                      // Nếu đã hủy và chưa có record, hiển thị nút Update bị vô hiệu hóa
                      <button
                        className="update-btn disabled"
                        disabled={true}
                        title="Không thể cập nhật lịch hẹn đã hủy"
                      >
                        Update
                      </button>
                    ) : appointment.status === "COMPLETED" ? (
                      // Nếu đã hoàn thành và chưa có record, hiển thị nút Update bình thường
                      <button
                        className="update-btn"
                        onClick={() => handleUpdateClick(appointment)}
                      >
                        Update
                      </button>
                    ) : (
                      // Trạng thái khác (như CONFIRMED) - hiển thị nút Update bị vô hiệu hóa
                      <button
                        className="update-btn disabled"
                        disabled={true}
                        title="Chỉ có thể cập nhật sau khi hoàn thành"
                      >
                        Update
                      </button>
                    )}
                  </td>

                  <td>
                    {appointment.status === "COMPLETED" &&
                      appointment.paymentStatus !== "PAID" && (
                        <button
                          className="payment-btn"
                          onClick={() => handlePayment(appointment)}
                          disabled={
                            processingPayment &&
                            processingPaymentId === appointment.appId
                          }
                        >
                          {processingPayment &&
                          processingPaymentId === appointment.appId
                            ? "Đang xử lý..."
                            : "Thanh toán"}
                        </button>
                      )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác nhận thay đổi</h2>
            <p>
              Bạn có chắc chắn muốn thay đổi trạng thái thành{" "}
              {pendingStatusChange?.newStatus}?
            </p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={confirmStatusChange}>
                Xác nhận
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cảnh báo</h2>
            <p>{warningMessage}</p>
            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={handleCloseWarningModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {/* Update Modal */}
      {showUpdateModal && (
        <div className="update-modal-overlay" onClick={handleOverlayClick}>
          <div className="update-modal">
            <div className="update-modal-header">
              <h2 className="update-modal-title">
                {isViewOnly ? "Xem thông tin" : "Cập nhật thông tin"}
              </h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-info">
              <div className="info-item">
                <span className="info-label">ID lịch tiêm:</span>
                <span className="info-value">{selectedAppointmentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Staff ID:</span>
                <span className="info-value">
                  {isViewOnly
                    ? getRecordForAppointment(selectedAppointmentId)
                        .staffName || "N/A"
                    : "ST001"}
                </span>
              </div>
              {isViewOnly && (
                <div className="info-item">
                  <span className="info-label">Ngày ghi nhận:</span>
                  <span className="info-value">
                    {getRecordForAppointment(selectedAppointmentId)
                      .appointmentDate || "N/A"}
                  </span>
                </div>
              )}
            </div>

            <div className="update-form">
              <div className="form-group">
                <label>Triệu chứng</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => !isViewOnly && setSymptoms(e.target.value)}
                  placeholder="Nhập triệu chứng"
                  readOnly={isViewOnly}
                  className={isViewOnly ? "readonly" : ""}
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={notes}
                  onChange={(e) => !isViewOnly && setNotes(e.target.value)}
                  placeholder="Nhập ghi chú"
                  readOnly={isViewOnly}
                  className={isViewOnly ? "readonly" : ""}
                />
              </div>
            </div>

            <div className="modal-footer">
              {!isViewOnly ? (
                <>
                  <button
                    className="save-button"
                    onClick={() => handleSaveClick(selectedAppointmentId)}
                  >
                    Lưu
                  </button>
                  <button className="cancel-button" onClick={handleCloseModal}>
                    Hủy bỏ
                  </button>
                </>
              ) : (
                <button
                  className="close-button-full"
                  onClick={handleCloseModal}
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAppointment;
