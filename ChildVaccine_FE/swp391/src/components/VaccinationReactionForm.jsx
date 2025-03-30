import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import childService from "../service/childService";
import appointmentService from "../service/appointmentService";
import reactionService from "../service/reactionService";
import sessionService from "../service/sessionService";
import "../styles/VaccinationReactionForm.css";

const VaccinationReactionForm = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [children, setChildren] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submittedReaction, setSubmittedReaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch children when component mounts
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const sessionData = await sessionService.checkSession();
        if (!sessionData || !sessionData.body.cusId) {
          throw new Error("No valid session found");
        }

        const childrenData = await childService.getCustomerChildren(
          sessionData.body.cusId
        );
        setChildren(childrenData);
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Không thể tải danh sách trẻ");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  useEffect(() => {
    let errorTimer;

    if (error) {
      errorTimer = setTimeout(() => {
        setError(null);
      }, 2000);
    }

    // Cleanup function để tránh memory leak
    return () => {
      if (errorTimer) clearTimeout(errorTimer);
    };
  }, [error]);

  // Fetch appointments when a child is selected
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedChild) return;

      try {
        setLoading(true);
        // Thay đổi hàm để lấy cuộc hẹn gần nhất
        const latestAppointment =
          await appointmentService.getLatedAppointmentsByChildId(selectedChild);

        // Nếu có cuộc hẹn, tự động chọn nó
        if (latestAppointment) {
          setAppointments([latestAppointment]); // Chỉ lưu 1 appointment trong mảng
          setSelectedAppointment(latestAppointment.appId); // Tự động chọn
        } else {
          setAppointments([]);
          setSelectedAppointment("");
        }
      } catch (err) {
        console.error("Error fetching latest appointment:", err);
        setError("Không thể tải thông tin buổi tiêm gần nhất");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedChild]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validation
      if (
        !selectedChild ||
        !selectedAppointment ||
        !description.trim() ||
        !severity
      ) {
        setError("Vui lòng điền đầy đủ thông tin");
        setIsSubmitting(false);
        return;
      }

      // Format the data to match exactly what the API expects
      const reactionData = {
        childId: selectedChild,
        appointmentId: selectedAppointment,
        symptoms: description.trim(),
        severity: severity,
        reactionDate: new Date().toISOString(),
      };

      console.log("📝 Submitting reaction data:", reactionData);

      const result = await reactionService.createReaction(reactionData);

      console.log("✅ Reaction submitted successfully:", result);

      // Reset form
      setSelectedChild("");
      setSelectedAppointment("");
      setDescription("");
      setSeverity("");
      setSubmittedReaction(result);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (err) {
      console.error("❌ Error details:", {
        message: err.message,
        error: err,
      });
      setError("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="form-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        <FaArrowLeft /> Quay lại trang chủ
      </button>
      <h1>Báo Cáo Phản Ứng Sau Tiêm</h1>

      {error && <div className="error-message">{error}</div>}
      {showSuccessMessage && (
        <div className="success-message">
          Báo cáo phản ứng đã được gửi thành công!
        </div>
      )}

      {showSuccessMessage && submittedReaction && (
        <div className="success-message">
          <h3>Báo cáo phản ứng đã được gửi thành công!</h3>
          <div className="success-details">
            <p>
              <strong>Mã báo cáo:</strong> {submittedReaction.id}
            </p>
            <p>
              <strong>Trẻ:</strong> {submittedReaction.child.fullName}
            </p>
            <p>
              <strong>Ngày tiêm:</strong>{" "}
              {new Date(
                submittedReaction.appointment.appointmentDate
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>
                {submittedReaction.appointment.packageId
                  ? "Gói vaccine:"
                  : "Vaccine:"}
              </strong>{" "}
              {submittedReaction.appointment.packageId
                ? submittedReaction.appointment.packageId.name
                : submittedReaction.appointment.vaccineId
                ? submittedReaction.appointment.vaccineId.name
                : "Không có thông tin"}
            </p>
            <p>
              <strong>Triệu chứng:</strong> {submittedReaction.symptoms}
            </p>
            <p>
              <strong>Mức độ:</strong>{" "}
              {submittedReaction.severity === "MILD"
                ? "Nhẹ"
                : submittedReaction.severity === "SEVERE"
                ? "Vừa"
                : submittedReaction.severity === "EMERGENCY"
                ? "Nặng"
                : submittedReaction.severity}
            </p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Chọn Hồ Sơ Trẻ:</label>
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            required
          >
            <option value="">-- Chọn trẻ --</option>
            {children.map((child) => (
              <option key={child.childId} value={child.childId}>
                {child.fullName} - {child.childId}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Buổi Tiêm Gần Nhất:</label>
          {appointments.length > 0 ? (
            <div className="appointment-info">
              <p>
                <strong>Ngày tiêm:</strong>{" "}
                {new Date(appointments[0].appointmentDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Mã cuộc hẹn:</strong> {appointments[0].appId}
              </p>
              <p>
                <strong>Vaccine/Gói:</strong> {appointments[0].serviceName}
              </p>
              <input
                type="hidden"
                name="selectedAppointment"
                value={selectedAppointment}
              />
            </div>
          ) : (
            <div className="no-appointment">
              Không tìm thấy buổi tiêm gần đây nào cho trẻ này. Vui lòng chọn
              trẻ khác hoặc liên hệ trung tâm tiêm chủng.
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Mô Tả Phản Ứng:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Nhập mô tả chi tiết về phản ứng sau tiêm..."
          />
        </div>

        <div className="form-group">
          <label>Mức Độ:</label>
          <div className="severity-buttons">
            <button
              type="button"
              className={`severity-btn mild ${
                severity === "MILD" ? "active" : ""
              }`}
              onClick={() => setSeverity("MILD")}
            >
              Nhẹ
            </button>
            <button
              type="button"
              className={`severity-btn severe ${
                severity === "SEVERE" ? "active" : ""
              }`}
              onClick={() => setSeverity("SEVERE")}
            >
              Vừa
            </button>
            <button
              type="button"
              className={`severity-btn emergency ${
                severity === "EMERGENCY" ? "active" : ""
              }`}
              onClick={() => setSeverity("EMERGENCY")}
            >
              Nặng
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi Báo Cáo"}
        </button>
      </form>
    </div>
  );
};

export default VaccinationReactionForm;
