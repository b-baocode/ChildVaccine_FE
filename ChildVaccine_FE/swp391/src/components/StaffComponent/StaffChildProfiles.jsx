import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  FaUserCircle,
  FaNotesMedical,
  FaRuler,
  FaWeight,
  FaSearch,
  FaAngleDown,
  FaAngleUp,
  FaCalendarCheck,
  FaSyringe,
  FaClock,
} from "react-icons/fa";
import childService from "../../service/childService";
import "../../styles/StaffStyles/StaffChildProfiles.css";
import appointmentService from "../../service/appointmentService";
import scheduleService from "../../service/scheduleService";

const StaffChildProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [childData, setChildData] = useState(null);
  const [childrenProfiles, setChildrenProfiles] = useState([]);
  const [childMedicalRecords, setChildMedicalRecords] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [exactIdSearch, setExactIdSearch] = useState("");

  const [schedules, setSchedules] = useState([]);
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);
  const [scheduleAppointments, setScheduleAppointments] = useState({});
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setExactIdSearch("");
      setError(null);
    }
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (selectedChildId) {
        try {
          const schedulesData = await scheduleService.getSchedulesByChildId(
            selectedChildId
          );
          console.log("Schedules for child:", schedulesData);
          setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
        } catch (error) {
          console.error("Error fetching schedules:", error);
        }
      }
    };

    fetchSchedules();
  }, [selectedChildId]);

  // Thêm hàm để toggle và fetch appointments
  const toggleScheduleDetails = async (scheduleId) => {
    // Nếu đang mở rộng schedule này, thì đóng lại
    if (expandedScheduleId === scheduleId) {
      setExpandedScheduleId(null);
      return;
    }

    // Đặt scheduleId được chọn
    setExpandedScheduleId(scheduleId);

    // Kiểm tra nếu chưa tải appointments cho schedule này
    if (!scheduleAppointments[scheduleId]) {
      try {
        setLoadingAppointments(true);
        const response = await appointmentService.getAppointmentsByScheduleId(
          scheduleId
        );
        console.log(`Appointments for schedule ${scheduleId}:`, response);

        // Xử lý cấu trúc dữ liệu đúng - kiểm tra xem có thuộc tính appointments không
        const appointmentsData = response.appointments || response;

        setScheduleAppointments((prev) => ({
          ...prev,
          [scheduleId]: Array.isArray(appointmentsData)
            ? appointmentsData
            : [appointmentsData],
        }));
      } catch (error) {
        console.error(
          `Error fetching appointments for schedule ${scheduleId}:`,
          error
        );
      } finally {
        setLoadingAppointments(false);
      }
    }
  };

  const handleSearchById = useCallback(async (e) => {
    e.preventDefault();

    // Lấy giá trị từ input thông qua target của form
    const searchInput = e.target.elements.searchInput.value;

    if (!searchInput.trim()) {
      setError(null);
      return;
    }

    const isId =
      /^\d+$/.test(searchInput.trim()) ||
      /^[A-Za-z0-9]+$/.test(searchInput.trim());

    if (isId) {
      try {
        setLoading(true);
        setError(null);

        // Sử dụng getChildProfile để lấy dữ liệu trực tiếp từ API
        const childData = await childService.getChildProfile(searchInput);

        if (childData) {
          // Chuyển đổi dữ liệu từ API để phù hợp với định dạng trong ứng dụng
          const transformedData = {
            child_id: childData.childId,
            cus_id: childData.customerId,
            full_name: childData.fullName,
            date_of_birth: childData.dateOfBirth,
            gender:
              childData.gender === "MALE"
                ? "Nam"
                : childData.gender === "FEMALE"
                ? "Nữ"
                : "Khác",
            height: childData.height || 0,
            weight: childData.weight || 0,
            blood_type: childData.bloodType || "Chưa xác định",
            allergies: childData.allergies || "Không",
            health_note: childData.healthNote || "Không có ghi chú",
          };

          // Cập nhật state trực tiếp với dữ liệu từ API
          setChildData(transformedData);
          setSelectedChildId(transformedData.child_id);

          // Thêm vào childrenProfiles nếu chưa có
          if (
            !childrenProfiles.some(
              (child) => child.child_id === transformedData.child_id
            )
          ) {
            setChildrenProfiles((prev) => [...prev, transformedData]);
          }
        } else {
          setError(`Không tìm thấy trẻ với ID: ${searchInput}`);
        }
      } catch (err) {
        console.error("Error fetching child profile:", err);
        setError(
          `Không thể tìm kiếm trẻ. ${err.message || "Vui lòng thử lại."}`
        );
      } finally {
        setLoading(false);
      }
    } else {
      setError("Vui lòng nhập ID hợp lệ");
    }
  }, []);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const data = await childService.getAllChildren();

        const transformedData = data.map((child) => ({
          child_id: child.childId,
          cus_id: child.customerId,
          full_name: child.fullName,
          date_of_birth: child.dateOfBirth,
          gender:
            child.gender === "MALE"
              ? "Nam"
              : child.gender === "FEMALE"
              ? "Nữ"
              : "Khác",
          height: child.height || 0,
          weight: child.weight || 0,
          blood_type: child.bloodType || "Chưa xác định",
          allergies: child.allergies || "Không",
          health_note: child.healthNote || "Không có ghi chú",
        }));

        console.log("Transformed children data:", transformedData);
        setChildrenProfiles(transformedData);

        // Chỉ set selectedChildId nếu chưa có giá trị
        if (!selectedChildId && transformedData.length > 0) {
          setSelectedChildId(transformedData[0].child_id);
        }
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Không thể tải danh sách trẻ");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []); // Empty dependency array as this should only run once on mount

  // Second useEffect to handle selected child changes
  useEffect(() => {
    if (!selectedChildId && childrenProfiles.length > 0) {
      setSelectedChildId(childrenProfiles[0].child_id);
    }
  }, [childrenProfiles]); // Chạy khi danh sách trẻ em thay đổi

  useEffect(() => {
    const fetchAppointments = async () => {
      if (selectedChildId) {
        try {
          const appointmentsData =
            await appointmentService.getAppointmentsByChildId(selectedChildId);
          setAppointments(appointmentsData);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };

    fetchAppointments();
  }, [selectedChildId]);

  useEffect(() => {
    if (selectedChildId) {
      const selectedChild = childrenProfiles.find(
        (child) => child.child_id === selectedChildId
      );
      setChildData(selectedChild || null);
    }
  }, [selectedChildId, childrenProfiles]);

  // Thay đổi cách lọc danh sách trẻ em
  const filteredChildren = childrenProfiles.filter((child) => {
    // Nếu đang tìm kiếm chính xác theo ID
    if (exactIdSearch) {
      return child.child_id.toString() === exactIdSearch;
    }

    // Nếu không, tìm kiếm bình thường theo tên hoặc ID
    return (
      child.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.child_id.toString().includes(searchTerm)
    );
  });

  if (!childData) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

  // In the same file
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (age === 0) {
      const monthAge =
        today.getMonth() -
        birth.getMonth() +
        (today.getDate() < birth.getDate() ? -1 : 0) +
        (today.getFullYear() - birth.getFullYear()) * 12;
      return `${monthAge} tháng`;
    }

    return `${age} tuổi`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const MedicalHistory = () => (
    <div className="medical-records">
      {schedules.length > 0 ? (
        <div className="schedule-list">
          {schedules.map((schedule) => (
            <div key={schedule.scheduleId} className="schedule-card">
              <div className="schedule-header">
                <div className="schedule-info">
                  <div className="schedule-id">
                    <FaCalendarCheck className="icon" />
                    <span>Lịch tiêm #{schedule.scheduleId}</span>
                  </div>
                  <div className="schedule-service">
                    <FaSyringe className="icon" />
                    <span>
                      {schedule.packageName
                        ? `Gói: ${schedule.packageName}`
                        : `Vaccine: ${
                            schedule.vaccineName || schedule.serviceName
                          }`}
                    </span>
                  </div>
                  <div className="schedule-date">
                    <FaClock className="icon" />
                    <span>Bắt đầu: {formatDate(schedule.startDate)}</span>
                  </div>
                  <span
                    className={`schedule-status ${
                      schedule.status
                        ? schedule.status.toLowerCase()
                        : "pending"
                    }`}
                  >
                    {schedule.status === "PENDING" && "Chờ xác nhận"}
                    {schedule.status === "CONFIRMED" && "Đã xác nhận"}
                    {schedule.status === "COMPLETED" && "Đã hoàn thành"}
                    {schedule.status === "CANCELLED" && "Đã hủy"}
                  </span>
                </div>
                <button
                  className="toggle-details-btn"
                  onClick={() => toggleScheduleDetails(schedule.scheduleId)}
                >
                  {expandedScheduleId === schedule.scheduleId ? (
                    <>
                      Thu gọn <FaAngleUp />
                    </>
                  ) : (
                    <>
                      Chi tiết <FaAngleDown />
                    </>
                  )}
                </button>
              </div>

              {expandedScheduleId === schedule.scheduleId && (
                <div className="schedule-details">
                  {loadingAppointments ? (
                    <div className="appointments-loading">
                      Đang tải chi tiết...
                    </div>
                  ) : scheduleAppointments[schedule.scheduleId]?.length > 0 ? (
                    <div className="appointments-table-container">
                      <h4>Các buổi hẹn trong lịch tiêm:</h4>
                      <div className="appointments-table-wrapper">
                        <table className="appointments-table">
                          <thead>
                            <tr>
                              <th>Mã hẹn</th>
                              <th>Mũi số</th>
                              <th>Vắc xin</th>
                              <th>Ngày hẹn</th>
                              <th>Giờ hẹn</th>
                              <th>Giá</th>
                              <th>Trạng thái</th>
                              <th>Thanh toán</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleAppointments[schedule.scheduleId].map(
                              (appointment) => (
                                <tr key={appointment.appId}>
                                  <td>{appointment.appId}</td>
                                  <td>{appointment.shotNumber || "N/A"}</td>
                                  <td>{appointment.serviceName || "N/A"}</td>
                                  <td>
                                    {formatDate(appointment.appointmentDate)}
                                  </td>
                                  <td>
                                    {appointment.appointmentTime
                                      ? appointment.appointmentTime.substring(
                                          0,
                                          5
                                        )
                                      : "N/A"}
                                  </td>
                                  <td>
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(appointment.price || 0)}
                                  </td>
                                  <td>
                                    <span
                                      className={`status-badge ${
                                        appointment.status
                                          ? appointment.status.toLowerCase()
                                          : "pending"
                                      }`}
                                    >
                                      {appointment.status === "PENDING" &&
                                        "Chờ xác nhận"}
                                      {appointment.status === "CONFIRMED" &&
                                        "Đã xác nhận"}
                                      {appointment.status === "COMPLETED" &&
                                        "Đã hoàn thành"}
                                      {appointment.status === "CANCELLED" &&
                                        "Đã hủy"}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={`payment-status ${
                                        appointment.paymentStatus
                                          ? appointment.paymentStatus.toLowerCase()
                                          : "pending"
                                      }`}
                                    >
                                      {appointment.paymentStatus ===
                                        "PENDING" && "Chưa thanh toán"}
                                      {appointment.paymentStatus ===
                                        "COMPLETED" && "Đã thanh toán"}
                                      {!appointment.paymentStatus && "N/A"}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="no-appointments">
                      Không có thông tin buổi hẹn
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-records">Chưa có lịch sử tiêm chủng</div>
      )}
    </div>
  );

  // In the same file
  const ProfileList = () => (
    <div className="profiles-sidebar">
      <form onSubmit={handleSearchById} className="staff-search-box">
        <FaSearch className="staff-search-icon" />
        <input
          type="text"
          name="searchInput" // Thêm name để dễ dàng truy cập trong handleSearchById
          placeholder="Tìm kiếm theo ID"
          className="staff-search-input"
          // Bỏ value và onChange để input trở thành uncontrolled component
        />
        <button type="submit" className="staff-search-button">
          Tìm ID
        </button>
      </form>

      {error && <div className="search-error">{error}</div>}

      <div className="profiles-list">
        {filteredChildren.map((child) => (
          <div
            key={child.child_id}
            className={`profile-item ${
              child.child_id === selectedChildId ? "active" : ""
            }`}
            onClick={() => setSelectedChildId(child.child_id)}
          >
            <FaUserCircle className="profile-icon" />
            <div className="profile-brief">
              <h3>{child.full_name}</h3>
              <p>
                <span>ID: {child.child_id}</span>
                <span> • </span>
                <span>{calculateAge(child.date_of_birth)}</span>
              </p>
            </div>
          </div>
        ))}

        {filteredChildren.length === 0 && !loading && (
          <div className="no-results">Không tìm thấy kết quả phù hợp</div>
        )}
      </div>
    </div>
  );

  const DetailView = () => (
    <div className="profile-content">
      <div className="child-profile-container">
        <div className="staff-profile-header">
          <div className="profile-avatar">
            <FaUserCircle size={80} color="#1976d2" />
          </div>
          <div className="profile-basic-info">
            <h1>{childData.full_name}</h1>
            <div className="profile-tags">
              <span className="profile-tag">ID: {childData.child_id}</span>
              <span className="profile-tag">{childData.gender}</span>
              <span className="profile-tag">
                {calculateAge(childData.date_of_birth)}
              </span>
              <span className="profile-tag">
                Nhóm máu: {childData.blood_type}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Thông tin chi tiết
          </button>
          <button
            className={`tab-btn ${activeTab === "medical" ? "active" : ""}`}
            onClick={() => setActiveTab("medical")}
          >
            Lịch sử khám bệnh
          </button>
        </div>

        {activeTab === "profile" ? (
          <div className="profile-details">
            <div className="details-grid">
              <div className="detail-card">
                <div className="card-header">
                  <div className="card-header-icons">
                    <FaRuler className="card-icon" />
                    <FaWeight className="card-icon" />
                  </div>
                  <h3>Chỉ số cơ thể</h3>
                </div>
                <div className="card-content">
                  <div className="metric-item">
                    <span className="metric-label">Chiều cao:</span>
                    <span className="metric-value">{childData.height} cm</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Cân nặng:</span>
                    <span className="metric-value">{childData.weight} kg</span>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <div className="card-header">
                  <FaNotesMedical className="card-icon" />
                  <h3>Thông tin y tế</h3>
                </div>
                <div className="card-content">
                  <div className="health-info">
                    <h4>Dị ứng:</h4>
                    <p
                      className={`health-text ${
                        childData.allergies === "Không" ? "normal" : "warning"
                      }`}
                    >
                      {childData.allergies}
                    </p>
                  </div>
                  <div className="health-info">
                    <h4>Ghi chú sức khỏe:</h4>
                    <p className="health-text">{childData.health_note}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MedicalHistory />
        )}
      </div>
    </div>
  );

  if (!childData) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="staff-child-profiles">
      <ProfileList />
      <DetailView />
    </div>
  );
};

export default StaffChildProfile;
