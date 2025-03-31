import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaClock,
  FaUserInjured,
  FaNotesMedical,
  FaCheck,
} from "react-icons/fa";
import "../../styles/StaffStyles/PostVaccinationInfo.css";
import reactionService from "../../service/reactionService";

const PostVaccineInfo = () => {
  const [reactions, setReactions] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);
        const data = await reactionService.getAllReactions();
        setReactions(data.filter((reaction) => reaction.check !== "CHECK"));
      } catch (err) {
        console.error("Error fetching reactions:", err);
        setError("Không thể tải dữ liệu phản ứng sau tiêm");
      } finally {
        setLoading(false);
      }
    };

    fetchReactions();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "MILD":
        return "severity-mild";
      case "SEVERE":
        return "severity-severe";
      case "EMERGENCY":
        return "severity-emergency";
      default:
        return "";
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReactions =
    selectedSeverity === "all"
      ? reactions
      : reactions.filter((reaction) => reaction.severity === selectedSeverity);

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const handleCheckReaction = async (id) => {
    setProcessingIds((prev) => [...prev, id]);

    try {
      await reactionService.updateCheckStatus(id);
      setReactions(reactions.filter((reaction) => reaction.id !== id));
      setNotification({
        type: "success",
        message: "Đã đánh dấu kiểm tra phản ứng thành công!",
      });
    } catch (err) {
      console.error("Error checking reaction:", err);
      setNotification({
        type: "error",
        message: "Không thể cập nhật trạng thái kiểm tra!",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((procId) => procId !== id));
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className="post-vaccine-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="page-header">
        <h1>Theo Dõi Phản Ứng Sau Tiêm</h1>
        <div className="severity-filter">
          <label>Lọc theo mức độ:</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="MILD">Nhẹ</option>
            <option value="SEVERE">Trung bình</option>
            <option value="EMERGENCY">Nặng</option>
          </select>
        </div>
      </div>

      <div className="reactions-grid">
        {filteredReactions.map((reaction) => (
          <div
            key={reaction.id}
            className={`reaction-card ${getSeverityColor(reaction.severity)}`}
          >
            <div className="card-header">
              <div className="severity-badge">
                <FaExclamationTriangle />
                {reaction.severity === "MILD" && "Nhẹ"}
                {reaction.severity === "SEVERE" && "Trung bình"}
                {reaction.severity === "EMERGENCY" && "Nặng"}
              </div>
              <div className="datetime">
                <FaClock />
                {formatDateTime(reaction.reactionDate)}
              </div>
            </div>

            <div className="patient-info">
              <h3>{reaction.childName}</h3>
              <span className="appointment-id">
                Mã tiêm: {reaction.appointmentId}
              </span>
              <span className="child-id">Mã trẻ: {reaction.childId}</span>
            </div>

            <div className="reaction-details">
              <div className="symptoms">
                <div className="detail-header">
                  <FaUserInjured />
                  <h4>Triệu chứng:</h4>
                </div>
                <p>{reaction.symptoms}</p>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="check-button"
                onClick={() => handleCheckReaction(reaction.id)}
                disabled={processingIds.includes(reaction.id)}
              >
                {processingIds.includes(reaction.id) ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <>
                    <FaCheck /> Đánh dấu đã kiểm tra
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReactions.length === 0 && (
        <div className="no-reactions">
          <p>Không có phản ứng nào cần kiểm tra</p>
        </div>
      )}
    </div>
  );
};

export default PostVaccineInfo;
