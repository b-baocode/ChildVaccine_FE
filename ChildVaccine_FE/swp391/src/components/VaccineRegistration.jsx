import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/VaccineRegistration.css";
import vaccineService from "../service/vaccineService";
import appointmentService from "../service/appointmentService";
import customerService from "../service/customerService";
import { useAuth } from "../context/AuthContext";
import sessionService from "../service/sessionService";
import scheduleService from "../service/scheduleService";

const VaccineRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    childProfile: "",
    appointmentDate: "",
    timeSlot: "",
    vaccineType: "",
    selectedItem: null,
    scheduleId: "", // Add this
  });

  const [formErrors, setFormErrors] = useState({
    childProfile: "",
    appointmentDate: "",
    timeSlot: "",
    selectedItem: "",
  });

  // State cho dữ liệu chính
  const [vaccines, setVaccines] = useState([]); // Danh sách vaccine từ API
  const [packages, setPackages] = useState([]); // Danh sách gói vaccine từ API
  const [customerInfo, setCustomerInfo] = useState(null);
  const [childProfiles, setChildProfiles] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Lưu thông tin lỗi
  const { user } = useAuth();
  const [guardianInfo, setGuardianInfo] = useState({
    cusId: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const [packagesVaccines, setPackagesVaccines] = useState({});
  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const [loadingPackageDetails, setLoadingPackageDetails] = useState(false);
  const [showPackageDetailsModal, setShowPackageDetailsModal] = useState(false);
  const [selectedAgeFilter, setSelectedAgeFilter] = useState(null);

  // State cho UI/UX
  const [selectedType, setSelectedType] = useState(""); // 'single' or 'package'
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Hiển thị modal xác nhận
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Hiển thị modal thành công
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedItemPrice, setSelectedItemPrice] = useState(0);
  const [selectedItemShots, setSelectedItemShots] = useState(0);
  const [slotAvailability, setSlotAvailability] = useState({});
  const [checking, setChecking] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [childrenWithActiveSchedules, setChildrenWithActiveSchedules] =
    useState([]);

  // Thêm useEffect để kiểm tra trạng thái schedule của mỗi trẻ
  useEffect(() => {
    const checkChildrenSchedules = async () => {
      if (childProfiles.length === 0) return;

      const activeChildIds = [];

      // Check each child for active schedules
      for (const child of childProfiles) {
        try {
          const schedules = await scheduleService.getSchedulesByChildId(
            child.childId
          );

          // Kiểm tra xem có schedule ACTIVE nào không
          const hasActiveSchedule = schedules.some(
            (schedule) => schedule.status === "ACTIVE"
          );

          if (hasActiveSchedule) {
            activeChildIds.push(child.childId);
          }
        } catch (error) {
          console.error(
            `Error checking schedules for child ${child.childId}:`,
            error
          );
        }
      }

      setChildrenWithActiveSchedules(activeChildIds);
    };

    checkChildrenSchedules();
  }, [childProfiles]);

  // Fetch data khi component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get session data
        const sessionData = await sessionService.checkSession();
        console.log("🔑 Session Data:", sessionData);

        if (!sessionData) {
          throw new Error("No session data found");
        }

        // Set customer info from session
        const userInfo = {
          cusId: sessionData.body.cusId, // Dữ liệu nằm trong body
          fullName: sessionData.body.user.fullName, // Truy cập user bên trong body
          phone: sessionData.body.user.phone,
          address: sessionData.body.address,
        };

        setCustomerInfo(userInfo);
        setGuardianInfo(userInfo);

        // Fetch children using session cusId
        const children = await customerService.getCustomerChildren(
          sessionData.body.cusId
        );
        console.log("🔑 ChildChild Data:", children);
        setChildProfiles(children);

        // Fetch vaccines and packages
        const [vaccinesData, packagesData] = await Promise.all([
          vaccineService.getVaccines(),
          vaccineService.getVaccinePackages(),
        ]);
        setVaccines(vaccinesData);
        setPackages(packagesData);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state && location.state.selectedItem) {
      const { selectedItem, selectedType } = location.state;

      console.log("📦 Pre-selected item from navigation:", {
        item: selectedItem,
        type: selectedType,
      });

      setSelectedType(selectedType);

      // Update formData to include the selected item
      setFormData((prev) => ({
        ...prev,
        vaccineType: selectedType,
        selectedItem:
          selectedType === "single"
            ? selectedItem.vaccineId
            : selectedItem.packageId,
      }));

      // Set the selected item name for display
      setSelectedItemName(selectedItem.name);
      setSelectedItemPrice(selectedItem.price);
      setSelectedItemShots(
        selectedType === "single" ? selectedItem.shotNumber : 1
      );
    }
  }, [location.state]);

  const fetchPackageDetails = async (packageId) => {
    if (expandedPackageId === packageId) {
      setExpandedPackageId(null);
      return;
    }

    setLoadingPackageDetails(true);
    try {
      if (!packagesVaccines[packageId]) {
        const vaccines = await vaccineService.getVaccinesByPackageId(packageId);
        setPackagesVaccines((prev) => ({
          ...prev,
          [packageId]: vaccines,
        }));
      }
      setExpandedPackageId(packageId);
    } catch (error) {
      console.error("Error fetching package details:", error);
    } finally {
      setLoadingPackageDetails(false);
    }
  };

  const PackageDetailsModal = () => {
    if (!showPackageDetailsModal) return null;

    return (
      <div className="package-details-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Danh sách chi tiết các gói tiêm</h3>
            <button
              className="close-modal-btn"
              onClick={() => setShowPackageDetailsModal(false)}
            >
              ×
            </button>
          </div>

          {packages.length === 0 ? (
            <p>Không có gói tiêm nào.</p>
          ) : (
            <div className="package-accordion">
              {packages.map((pkg) => (
                <div
                  key={pkg.packageId}
                  className={`package-accordion-item ${
                    pkg.available === false ? "unavailable" : ""
                  }`}
                >
                  <div
                    className="package-header"
                    onClick={() =>
                      pkg.available !== false &&
                      fetchPackageDetails(pkg.packageId)
                    }
                  >
                    <h4>{pkg.name}</h4>
                    {pkg.available === false && (
                      <span className="unavailable-tag">Không khả dụng</span>
                    )}
                    <div className="package-price">
                      {Number(pkg.price).toLocaleString("vi-VN")} VND
                    </div>
                    <span className="expand-icon">
                      {pkg.available !== false &&
                      expandedPackageId === pkg.packageId
                        ? "▼"
                        : "►"}
                    </span>
                  </div>

                  {pkg.available !== false &&
                    expandedPackageId === pkg.packageId && (
                      <div className="package-content">
                        {loadingPackageDetails ? (
                          <p>Đang tải danh sách vắc xin...</p>
                        ) : (
                          <div>
                            <p className="package-description">
                              {pkg.description}
                            </p>
                            <h5>Vắc xin trong gói:</h5>
                            {packagesVaccines[pkg.packageId]?.length > 0 ? (
                              <ul className="vaccine-list">
                                {packagesVaccines[pkg.packageId].map(
                                  (vaccine) => (
                                    <li
                                      key={vaccine.vaccineId}
                                      className="vaccine-item"
                                    >
                                      <strong>{vaccine.name}</strong>
                                      <p>{vaccine.description}</p>
                                      <div className="vaccine-details">
                                        {vaccine.shotNumber > 0 && (
                                          <span>
                                            Số mũi: {vaccine.shotNumber}
                                          </span>
                                        )}
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p>
                                Không có thông tin về vắc xin trong gói này.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
          <div className="modal-footer"></div>
        </div>
      </div>
    );
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "appointmentDate") {
      // Reset time slot when date changes
      setFormData((prevState) => ({
        ...prevState,
        timeSlot: "",
      }));
      setSlotError("");
    }

    if (name === "timeSlot" && value && formData.appointmentDate) {
      await checkSlotAvailability(formData.appointmentDate, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentSlot =
      slotAvailability[`${formData.appointmentDate}-${formData.timeSlot}`];

    // Add date validation
    const selectedDate = new Date(formData.appointmentDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Clear previous error
    setError("");

    // Validate time slot
    if (!currentSlot) {
      setSlotError("Vui lòng chọn khung giờ hợp lệ");
      return false;
    }

    if (currentSlot.isFull) {
      setSlotError("Khung giờ này đã đầy. Vui lòng chọn khung giờ khác.");
      return false;
    }

    if (selectedDate < tomorrow) {
      setError("Vui lòng chọn ngày từ ngày mai trở đi");
      return false;
    }

    // If all validations pass, show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmRegistration = async () => {
    try {
      // Format time slot from "0730" to "07:30:00"
      const formatTimeSlot = (timeSlot) => {
        const hour = timeSlot.substring(0, 2);
        const minute = timeSlot.substring(2);
        return `${hour}:${minute}:00`;
      };

      // Reset previous errors
      setFormErrors({
        childProfile: "",
        appointmentDate: "",
        timeSlot: "",
        selectedItem: "",
      });

      // Validate all required fields
      const newErrors = {};
      if (!formData.childProfile) {
        newErrors.childProfile = "Vui lòng chọn hồ sơ trẻ";
      }
      if (!formData.appointmentDate) {
        newErrors.appointmentDate = "Vui lòng chọn ngày hẹn";
      }
      if (!formData.timeSlot) {
        newErrors.timeSlot = "Vui lòng chọn khung giờ";
      }
      if (!formData.selectedItem) {
        newErrors.selectedItem = "Vui lòng chọn vắc xin/gói vắc xin";
      }

      // If there are any errors, show them and return
      if (Object.keys(newErrors).length > 0) {
        setFormErrors(newErrors);
        setShowConfirmModal(false);
        return;
      }

      // Prepare registration data
      const registrationData = {
        customerId: guardianInfo.cusId,
        childId: formData.childProfile,
        vaccineId: selectedType === "single" ? formData.selectedItem : null,
        packageId: selectedType === "package" ? formData.selectedItem : null,
        startDate: formData.appointmentDate,
        firstAppTime: formatTimeSlot(formData.timeSlot),
      };

      console.log("Sending registration data:", registrationData);
      const result = await scheduleService.scheduleRegister(registrationData);

      if (result.ok) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        setFormData((prev) => ({
          ...prev,
          scheduleId: result.scheduleId,
        }));
        setTimeout(() => {
          setFormData({
            childProfile: "",
            appointmentDate: "",
            timeSlot: "",
            vaccineType: "",
            selectedItem: null,
            scheduleId: "",
          });
          setShowSuccessModal(false);
          navigate("/");
        }, 2000);
      } else {
        setError(result.error || "Đăng ký thất bại. Vui lòng thử lại.");
        setShowConfirmModal(false);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.");
      setShowConfirmModal(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setFormData({
      childProfile: "",
      appointmentDate: "",
      timeSlot: "",
      vaccineType: "",
    });
    setSelectedType(""); // Updated from setSelectedVaccineType
  };

  const checkSlotAvailability = async (date, timeSlot) => {
    if (!date || !timeSlot) return;

    setChecking(true);
    setSlotError("");

    try {
      const availability = await appointmentService.checkSlotAvailability(
        date,
        timeSlot
      );
      setSlotAvailability((prev) => ({
        ...prev,
        [`${date}-${timeSlot}`]: availability,
      }));

      if (availability.isFull) {
        setSlotError(
          "Khung giờ này đã đạt giới hạn đặt lịch. Vui lòng chọn khung giờ khác."
        );
      }
    } catch (error) {
      setSlotError(
        "Không thể kiểm tra tình trạng khung giờ. Vui lòng thử lại."
      );
    } finally {
      setChecking(false);
    }
  };

  // Xử lý khi chọn loại vaccine
  const handleVaccineTypeSelect = (type) => {
    setSelectedType(type);
    setFormData((prev) => ({
      ...prev,
      vaccineType: type,
      selectedItem: null, // Reset selected item when switching types
    }));
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getSelectedChildName = () => {
    const selectedChild = childProfiles.find(
      (child) => child.childId === formData.childProfile
    );
    return selectedChild ? selectedChild.fullName : "Không tìm thấy";
  };

  // Xử lý chọn vaccine/gói cụ thể
  const handleSelectItem = (item) => {
    // Kiểm tra khả dụng dựa trên loại sản phẩm
    if (selectedType === "package" && item.available === false) {
      return; // Không cho phép chọn gói không khả dụng
    }

    if (selectedType === "single" && item.quantity <= 0) {
      return; // Không cho phép chọn vaccine đã hết
    }

    const itemId = selectedType === "single" ? item.vaccineId : item.packageId;
    setFormData((prev) => ({
      ...prev,
      selectedItem: prev.selectedItem === itemId ? null : itemId,
    }));
    setSelectedItemName(item.name);
    setSelectedItemPrice(item.price);

    if (selectedType === "single") {
      setSelectedItemShots(item.shotNumber);
    }
  };

  const ConfirmationModal = () => (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h2>Xác nhận thông tin đăng ký</h2>
        <div className="confirm-section">
          <h3>Thông tin người giám hộ</h3>
          <div className="info-grid">
            <div key="guardian-id" className="info-item">
              <span className="label">ID:</span>
              <span className="value">{guardianInfo.cusId}</span>
            </div>
            <div key="guardian-name" className="info-item">
              <span className="label">Họ và tên:</span>
              <span className="value">{guardianInfo.fullName}</span>
            </div>
            <div key="guardian-phone" className="info-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">{guardianInfo.phone}</span>
            </div>
            <div key="guardian-address" className="info-item">
              <span className="label">Địa chỉ:</span>
              <span className="value">{guardianInfo.address}</span>
            </div>
          </div>
        </div>
        <div className="confirm-section">
          <h3>Thông tin đăng ký tiêm</h3>
          <div className="info-grid">
            <div key="child-profile" className="info-item">
              <span className="label">Tên trẻ:</span>
              <span className="value">
                {formData.childProfile} - {getSelectedChildName()}
              </span>
            </div>
            <div key="selected-item" className="info-item">
              <span className="label">Vắc xin đã chọn:</span>
              <span className="value">{selectedItemName}</span>
            </div>
            <div key="selected-price" className="info-item">
              <span className="label">Giá tiền:</span>
              <span className="value price-value">
                {Number(selectedItemPrice).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div key="appointment-date" className="info-item">
              <span className="label">Ngày hẹn:</span>
              <span className="value">{formData.appointmentDate}</span>
            </div>
            <div key="time-slot" className="info-item">
              <span className="label">Khung giờ:</span>
              <span className="value">
                {formData.timeSlot === "0730" && "07:30 - 08:00"}
                {formData.timeSlot === "0800" && "08:00 - 08:30"}
                {formData.timeSlot === "0830" && "08:30 - 09:00"}
                {formData.timeSlot === "0900" && "09:00 - 09:30"}
                {formData.timeSlot === "0930" && "09:30 - 10:00"}
                {formData.timeSlot === "1000" && "10:00 - 10:30"}
                {formData.timeSlot === "1030" && "10:30 - 11:00"}
                {formData.timeSlot === "1100" && "11:00 - 11:30"}
                {formData.timeSlot === "1130" && "11:30 - 12:00"}
                {formData.timeSlot === "1330" && "13:30 - 14:00"}
                {formData.timeSlot === "1400" && "14:00 - 14:30"}
                {formData.timeSlot === "1430" && "14:30 - 15:00"}
                {formData.timeSlot === "1500" && "15:00 - 15:30"}
                {formData.timeSlot === "1530" && "15:30 - 16:00"}
                {formData.timeSlot === "1600" && "16:00 - 16:30"}
                {formData.timeSlot === "1630" && "16:30 - 17:00"}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={() => setShowConfirmModal(false)}
          >
            Hủy bỏ
          </button>
          <button className="confirm-btn" onClick={handleConfirmRegistration}>
            Xác nhận đăng ký
          </button>
        </div>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <div className="success-modal">
      <div className="modal-content success">
        <div className="success-icon">✓</div>
        <h2>Đăng ký thành công!</h2>
        <p>Thông tin đăng ký của bạn đã được ghi nhận.</p>
        {formData.scheduleId && (
          <p>
            Mã cuộc hẹn: <strong>{formData.scheduleId}</strong>
          </p>
        )}
        <button className="success-btn" onClick={handleSuccessClose}>
          Đóng
        </button>
      </div>
    </div>
  );
  // Cập nhật phần render thông tin guardian
  const renderGuardianInfo = () => {
    if (!customerInfo) return null;

    return (
      <div className="guardian-info">
        <div className="info-row">
          <div className="info-field">
            <label>ID:</label>
            <div className="info-value">{customerInfo.cusId}</div>
          </div>
          <div className="info-field">
            <label>Họ và tên:</label>
            <div className="info-value">{customerInfo.fullName}</div>
          </div>
        </div>
        <div className="info-row">
          <div className="info-field">
            <label>Số điện thoại:</label>
            <div className="info-value">{customerInfo.phone}</div>
          </div>
          <div className="info-field">
            <label>Địa chỉ:</label>
            <div className="info-value">{customerInfo.address}</div>
          </div>
        </div>
      </div>
    );
  };

  // Cập nhật lại hàm renderChildProfiles để lọc trẻ có lịch ACTIVE
  const renderChildProfiles = () => {
    // Lọc danh sách trẻ, loại bỏ những trẻ có lịch ACTIVE
    const availableChildren = childProfiles.filter(
      (child) => !childrenWithActiveSchedules.includes(child.childId)
    );

    return (
      <div className="child-profile-section">
        <select
          name="childProfile"
          value={formData.childProfile}
          onChange={handleInputChange}
          required
          className="profile-select"
        >
          <option value="">
            {availableChildren.length === 0
              ? "-- Không có trẻ có thể đăng ký --"
              : "-- Chọn trẻ --"}
          </option>
          {availableChildren.map((child) => (
            <option key={child.childId} value={child.childId}>
              {child.childId} - {child.fullName}
            </option>
          ))}
        </select>

        {childrenWithActiveSchedules.length > 0 && (
          <div className="info-message">
            <i className="fas fa-info-circle"></i>
            Một số trẻ không được hiển thị do đang có lịch tiêm đang hoạt động.
          </div>
        )}
      </div>
    );
  };

  // Cập nhật hàm renderItemList
  const renderItemList = () => {
    const items = selectedType === "single" ? vaccines : packages;

    // Lọc vaccine theo độ tuổi đã chọn
    const filteredItems =
      selectedType === "single" && selectedAgeFilter
        ? items.filter((item) => item.ageMonth === selectedAgeFilter)
        : items;

    console.log("🎯 Rendering items:", {
      selectedType,
      itemsCount: filteredItems.length,
      selectedAge: selectedAgeFilter,
      items: filteredItems.map((item) => ({
        id: selectedType === "single" ? item.vaccineId : item.packageId,
        name: item.name,
        price: item.price,
        age: item.ageMonth,
        shots: selectedType === "single" ? item.shotNumber : "N/A",
        isSelected:
          formData.selectedItem ===
          (selectedType === "single" ? item.vaccineId : item.packageId),
        available:
          selectedType === "package" ? item.available : item.quantity > 0,
      })),
    });

    if (filteredItems.length === 0) {
      return (
        <div className="no-items-message">
          {selectedType === "single" && selectedAgeFilter
            ? "Không có vaccine phù hợp cho độ tuổi này"
            : "Không có dữ liệu để hiển thị"}
        </div>
      );
    }

    return (
      <div className="item-grid">
        {filteredItems.map((item) => {
          const itemId =
            selectedType === "single" ? item.vaccineId : item.packageId;

          // Kiểm tra xem item có khả dụng không
          const isAvailable =
            selectedType === "single"
              ? item.quantity > 0 // Với vaccine, kiểm tra quantity
              : item.available !== false; // Với package, kiểm tra available

          return (
            <div
              key={itemId}
              className={`item-card ${
                formData.selectedItem === itemId ? "selected" : ""
              } ${!isAvailable ? "unavailable" : ""}`}
              onClick={() => isAvailable && handleSelectItem(item)}
              title={
                !isAvailable
                  ? selectedType === "single"
                    ? "Vaccine này hiện đã hết"
                    : "Gói vaccine này hiện không khả dụng"
                  : ""
              }
            >
              <h4>{item.name}</h4>
              {!isAvailable && (
                <span className="unavailable-tag">
                  {selectedType === "single" ? "Hết hàng" : "Không khả dụng"}
                </span>
              )}
              <p>{item.description}</p>
              <div className="item-details">
                <span className="price">
                  {Number(item.price).toLocaleString("vi-VN")} VND
                </span>
                {selectedType === "single" && (
                  <>
                    <span className="shots">Số mũi: {item.shotNumber}</span>
                    <span className="quantity">Còn lại: {item.quantity}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Thêm hàm để xử lý việc chọn filter theo độ tuổi
  const handleAgeFilterSelect = (age) => {
    setSelectedAgeFilter((prevAge) => (prevAge === age ? null : age));
  };

  // Thêm component hiển thị các lựa chọn độ tuổi
  const renderAgeFilters = () => {
    if (selectedType !== "single") return null;

    const ageFilters = [
      { age: 2, label: "Vaccine dành cho trẻ từ 0 - 2 tuổi" },
      { age: 4, label: "Vaccine dành cho trẻ từ 2 - 4 tuổi" },
      { age: 6, label: "Vaccine dành cho trẻ từ 4 - 6 tuổi" },
      { age: 12, label: "Vaccine dành cho trẻ từ 6 - 12 tuổi" },
    ];

    return (
      <div className="age-filter-container">
        {ageFilters.map((filter) => (
          <div
            key={filter.age}
            className={`age-filter-item ${
              selectedAgeFilter === filter.age ? "active" : ""
            }`}
            onClick={() => handleAgeFilterSelect(filter.age)}
          >
            {filter.label}
          </div>
        ))}
      </div>
    );
  };

  // Update the time slot render function
  const renderTimeSlots = () => {
    const timeSlots = [
      { value: "0730", label: "07:30 - 08:00" },
      { value: "0800", label: "08:00 - 08:30" },
      { value: "0830", label: "08:30 - 09:00" },
      { value: "0900", label: "09:00 - 09:30" },
      { value: "0930", label: "09:30 - 10:00" },
      { value: "1000", label: "10:00 - 10:30" },
      { value: "1030", label: "10:30 - 11:00" },
      { value: "1100", label: "11:00 - 11:30" },
      { value: "1130", label: "11:30 - 12:00" },
      { value: "1330", label: "13:30 - 14:00" },
      { value: "1400", label: "14:00 - 14:30" },
      { value: "1430", label: "14:30 - 15:00" },
      { value: "1500", label: "15:00 - 15:30" },
      { value: "1530", label: "15:30 - 16:00" },
      { value: "1600", label: "16:00 - 16:30" },
      { value: "1630", label: "16:30 - 17:00" },
    ];

    // Lọc các khung giờ để chỉ hiển thị các khung giờ còn trống
    const availableTimeSlots = formData.appointmentDate
      ? timeSlots.filter((slot) => {
          const availability =
            slotAvailability[`${formData.appointmentDate}-${slot.value}`];
          // Nếu chưa kiểm tra availability hoặc slot còn trống thì hiển thị
          return (
            !availability ||
            (availability &&
              availability.currentCount < availability.maxAllowed)
          );
        })
      : timeSlots;

    return (
      <div className="time-field">
        <label>Chọn khung giờ</label>
        <select
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleInputChange}
          required
          disabled={!formData.appointmentDate || checking}
          className={slotError ? "error" : ""}
        >
          <option value="">-- Chọn giờ --</option>
          {availableTimeSlots.map((slot) => {
            const availability = formData.appointmentDate
              ? slotAvailability[`${formData.appointmentDate}-${slot.value}`]
              : null;

            return (
              <option key={slot.value} value={slot.value}>
                {slot.label}
                {availability &&
                  ` (${
                    availability.maxAllowed - availability.currentCount
                  } slot còn trống)`}
              </option>
            );
          })}
        </select>
        {checking && (
          <div className="checking-message">Đang kiểm tra slot...</div>
        )}
        {slotError && <div className="error-message">{slotError}</div>}
        {formData.appointmentDate && availableTimeSlots.length === 0 && (
          <div className="no-slots-message">
            Không có khung giờ trống cho ngày đã chọn
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="registration-form">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && (
        <>
          <button className="back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft /> Quay lại trang chủ
          </button>
          <h2>Thông Tin Người Giám Hộ</h2>
          {renderGuardianInfo()}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Chọn Hồ Sơ Trẻ:</label>
              <div className="profile-selection">
                {renderChildProfiles()}
                {formErrors.childProfile && (
                  <div className="error-message">{formErrors.childProfile}</div>
                )}
                {/* ...existing buttons... */}
                <button
                  type="button"
                  className="add-child-btn"
                  onClick={() => navigate("/add-child")}
                >
                  + Thêm hồ sơ trẻ mới
                </button>
              </div>
            </div>

            <div className="service-info">
              {formErrors.selectedItem && (
                <div className="error-message">{formErrors.selectedItem}</div>
              )}
              <div className="service-info-header">
                <h3>THÔNG TIN DỊCH VỤ</h3>
                <button
                  type="button"
                  className="details-btn"
                  onClick={() => setShowPackageDetailsModal(true)}
                >
                  Danh sách chi tiết các gói tiêm
                </button>
              </div>

              <div className="vaccine-type">
                <label>Loại vắc xin muốn đăng ký:</label>
                <div className="vaccine-buttons">
                  <button
                    type="button"
                    className={`vaccine-btn ${
                      selectedType === "package" ? "active" : ""
                    }`}
                    onClick={() => handleVaccineTypeSelect("package")}
                  >
                    Vắc xin gói
                  </button>
                  <button
                    type="button"
                    className={`vaccine-btn ${
                      selectedType === "single" ? "active" : ""
                    }`}
                    onClick={() => handleVaccineTypeSelect("single")}
                  >
                    Vắc xin lẻ
                  </button>
                </div>
              </div>

              {selectedType && (
                <div className="item-selection">
                  <h4>Chọn {selectedType === "single" ? "Vắc xin" : "Gói"}:</h4>
                  {selectedType === "single" && renderAgeFilters()}
                  {renderItemList()} {/* Hiển thị danh sách cho cả 2 loại */}
                </div>
              )}

              <div className="appointment-time">
                <div className="time-field">
                  {formErrors.appointmentDate && (
                    <div className="error-message">
                      {formErrors.appointmentDate}
                    </div>
                  )}
                  <label>Chọn ngày hẹn tiêm</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    min={getTomorrowDate()}
                    required
                  />
                </div>
                {formErrors.timeSlot && (
                  <div className="error-message">{formErrors.timeSlot}</div>
                )}
                {renderTimeSlots()}
              </div>
            </div>

            {error && (
              <div className="error-message general-error">{error}</div>
            )}

            <button type="submit" className="submit-btn">
              XÁC NHẬN ĐĂNG KÝ
            </button>
          </form>

          {showConfirmModal && <ConfirmationModal />}
          {showSuccessModal && <SuccessModal />}
          {showPackageDetailsModal && <PackageDetailsModal />}
        </>
      )}
    </div>
  );
};

export default VaccineRegistration;
