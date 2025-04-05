import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaSyringe,
  FaBoxes,
  FaInfoCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaArrowRight,
} from "react-icons/fa";
import vaccineService from "../../service/vaccineService";
import "../../styles/AdminStyles/VaccineManage.css";

const VaccineManage = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // State cho modal tạo mới
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho modal cập nhật
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentVaccine, setCurrentVaccine] = useState(null);
  const [updateType, setUpdateType] = useState(""); // 'quantity' hoặc 'info'
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Form state cho tạo mới
  const [newVaccine, setNewVaccine] = useState({
    name: "",
    description: "",
    manufacturer: "",
    gapDays: 0,
    shotNumber: 1,
    quantity: 0,
    price: 0,
    ageMonth: 0,
  });

  // Fetch vaccines khi component mount
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true);
        const data = await vaccineService.getVaccines();
        setVaccines(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu vaccine. Vui lòng thử lại sau.");
        console.error("Lỗi khi tải vaccine:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      // Nếu ô tìm kiếm trống, lấy tất cả vaccine
      try {
        setLoading(true);
        const data = await vaccineService.getVaccines();
        setVaccines(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu vaccine. Vui lòng thử lại sau.");
        console.error("Lỗi khi tải vaccine:", err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const data = await vaccineService.getVaccinesByName(searchTerm);

      // Kiểm tra và xử lý dữ liệu trả về
      if (data) {
        if (Array.isArray(data)) {
          // Nếu data là mảng (nhiều kết quả)
          setVaccines(data);
          if (data.length === 0) {
            showNotification("info", "Không tìm thấy vaccine phù hợp");
          } else {
            showNotification("success", `Tìm thấy ${data.length} vaccine`);
          }
        } else {
          // Nếu data là object đơn lẻ (một vaccine)
          setVaccines([data]);
          showNotification("success", "Đã tìm thấy vaccine");
        }
      } else {
        setVaccines([]);
        showNotification("info", "Không tìm thấy vaccine phù hợp");
      }

      setError(null);
    } catch (err) {
      setError("Không thể tìm kiếm vaccine. Vui lòng thử lại sau.");
      console.error("Lỗi khi tìm kiếm vaccine:", err);
      setVaccines([]); // Đặt mảng rỗng để tránh lỗi
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleCreateVaccine = () => {
    setShowCreateModal(true);
  };

  const handleUpdateQuantity = (vaccine) => {
    setCurrentVaccine(vaccine);
    setUpdateType("quantity");
    setShowUpdateModal(true);
  };

  const handleUpdateInfo = (vaccine) => {
    setCurrentVaccine(vaccine);
    setUpdateType("info");
    setShowUpdateModal(true);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000); // Ẩn sau 3 giây
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Modal tạo mới vaccine
  const CreateVaccineModal = () => {
    // Tạo local state để lưu dữ liệu form tạm thời
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      manufacturer: "",
      gapDays: 0,
      shotNumber: 1,
      quantity: 0,
      price: 0,
      ageMonth: 0,
    });

    const handleSubmit = async (e) => {
      e.preventDefault();

      const formElements = e.target.elements;
      const formData = {
        name: formElements.name.value,
        description: formElements.description.value,
        manufacturer: formElements.manufacturer.value,
        gapDays: Number(formElements.gapDays.value),
        shotNumber: Number(formElements.shotNumber.value),
        quantity: Number(formElements.quantity.value),
        price: Number(formElements.price.value),
        ageMonth: Number(formElements.ageMonth.value),
      };

      // Kiểm tra dữ liệu trước khi gửi
      if (formData.price <= 0) {
        showNotification("error", "Giá vaccine phải lớn hơn 0");
        return;
      }

      if (formData.quantity < 0) {
        showNotification("error", "Số lượng không được âm");
        return;
      }

      try {
        setIsSubmitting(true);
        setLoading(true);

        // Gọi API tạo vaccine mới
        await vaccineService.createVaccine(formData);

        // Cập nhật lại danh sách vaccine
        const updatedVaccinesList = await vaccineService.getVaccines();
        setVaccines(updatedVaccinesList);

        setShowCreateModal(false);
        showNotification("success", "Tạo vaccine mới thành công!");

        // Reset form
        setFormData({
          name: "",
          description: "",
          manufacturer: "",
          gapDays: 0,
          shotNumber: 1,
          quantity: 0,
          price: 0,
          ageMonth: 0,
        });
      } catch (error) {
        console.error("Lỗi khi tạo vaccine mới:", error);
        showNotification(
          "error",
          `Lỗi: ${error.message || "Không thể tạo vaccine mới"}`
        );
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    };

    return (
      <div className="vaccine-modal">
        <div className="vaccine-modal-content">
          <h2>Tạo Vaccine Mới</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên vaccine:</label>
              <input type="text" name="name" defaultValue="" required />
            </div>

            <div className="form-group">
              <label>Mô tả:</label>
              <textarea name="description" defaultValue="" required />
            </div>

            <div className="form-group">
              <label>Nhà sản xuất:</label>
              <input type="text" name="manufacturer" defaultValue="" required />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>Số ngày giữa các mũi:</label>
                <input
                  type="number"
                  name="gapDays"
                  defaultValue="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group half">
                <label>Số mũi tiêm:</label>
                <input
                  type="number"
                  name="shotNumber"
                  defaultValue="1"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>Số lượng:</label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group half">
                <label>Độ tuổi (tháng):</label>
                <input
                  type="number"
                  name="ageMonth"
                  defaultValue="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Giá (VND):</label>
              <input
                type="number"
                name="price"
                defaultValue="0"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="modal-buttons">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="cancel-button"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang tạo..." : "Tạo Vaccine"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal cập nhật vaccine
  const UpdateVaccineModal = () => {
    // Để hiển thị giá trị ban đầu, chỉ sử dụng defaultValue thay vì value

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const formElements = e.target.elements;

        if (updateType === "info") {
          // Lấy dữ liệu trực tiếp từ form
          const updateData = {
            description: formElements.description.value,
            price: Number(formElements.price.value),
            ageMonth: Number(formElements.ageMonth.value),
          };

          await vaccineService.updateVaccine(
            currentVaccine.vaccineId,
            updateData
          );
          showNotification("success", "Cập nhật thông tin vaccine thành công!");
        } else if (updateType === "quantity") {
          // Lấy dữ liệu trực tiếp từ form
          const inputQuantity = Number(formElements.inputQuantity.value);
          // Với radio buttons, cần kiểm tra trạng thái checked
          const method = formElements.method[0].checked; // true nếu option đầu tiên được chọn

          const quantityData = {
            inputQuantity: inputQuantity,
            method: method,
          };

          await vaccineService.changeVaccineQuantity(
            currentVaccine.vaccineId,
            quantityData
          );
          showNotification("success", "Cập nhật số lượng vaccine thành công!");
        }

        // Cập nhật lại danh sách vaccine
        const updatedVaccinesList = await vaccineService.getVaccines();
        setVaccines(updatedVaccinesList);

        setShowUpdateModal(false);
      } catch (error) {
        console.error("Lỗi khi cập nhật vaccine:", error);
        showNotification(
          "error",
          `Lỗi: ${error.message || "Không thể cập nhật vaccine"}`
        );
      } finally {
        setLoading(false);
      }
    };

    // UI cho cập nhật số lượng
    if (updateType === "quantity" && currentVaccine) {
      return (
        <div className="vaccine-modal">
          <div className="vaccine-modal-content">
            <h2>Cập Nhật Số Lượng Vaccine</h2>
            <h3>{currentVaccine.name}</h3>

            <div className="current-quantity-display">
              <span className="quantity-label">Số lượng hiện tại:</span>
              <span className="quantity-value">
                {currentVaccine.quantity} liều
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Số lượng muốn thay đổi:</label>
                <input
                  type="number"
                  name="inputQuantity"
                  defaultValue="0"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="method-label">Phương thức:</label>
                <div className="method-options">
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="true"
                      defaultChecked={true}
                    />
                    <span>Thêm vào kho (+)</span>
                  </label>
                  <label className="method-option">
                    <input type="radio" name="method" value="false" />
                    <span>Lấy ra khỏi kho (-)</span>
                  </label>
                </div>
              </div>

              {/* Phần hiển thị kết quả sẽ bị ảnh hưởng vì không có state tracking
                  Có thể thêm một chút JavaScript để cập nhật phần preview này */}

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="cancel-button"
                >
                  Hủy
                </button>
                <button type="submit" className="submit-button">
                  Cập Nhật Số Lượng
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // UI cho cập nhật thông tin
    if (updateType === "info" && currentVaccine) {
      return (
        <div className="vaccine-modal">
          <div className="vaccine-modal-content">
            <h2>Cập Nhật Thông Tin Vaccine</h2>
            <h3>{currentVaccine.name}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  name="description"
                  defaultValue={currentVaccine.description}
                  required
                  rows={4}
                  placeholder="Mô tả chi tiết về vaccine..."
                />
              </div>

              <div className="form-group">
                <label>Giá (VND):</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={currentVaccine.price}
                  min="0"
                  step="1000"
                  required
                  className="price-input"
                />
                <small className="form-text">Nhập giá theo đơn vị VND</small>
              </div>

              <div className="form-group">
                <label>Độ tuổi (tháng):</label>
                <select
                  name="ageMonth"
                  defaultValue={currentVaccine.ageMonth}
                  required
                  className="age-select"
                >
                  <option value="">-- Chọn độ tuổi --</option>
                  <option value="2">2 tháng tuổi</option>
                  <option value="4">4 tháng tuổi</option>
                  <option value="6">6 tháng tuổi</option>
                  <option value="12">12 tháng tuổi</option>
                </select>
              </div>

              <div className="form-info">
                <p>
                  <strong>Lưu ý:</strong> Chỉ có thể cập nhật mô tả, giá và độ
                  tuổi cho vaccine.
                </p>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="cancel-button"
                >
                  Hủy
                </button>
                <button type="submit" className="submit-button">
                  Cập Nhật Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return null;
  };

  // Render component chính
  return (
    <div className="vaccine-manage-container">
      <div className="vaccine-header">
        <h1 className="green-title">Quản Lý Vaccine</h1>

        <div className="vaccine-search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm vaccine theo tên..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              {isSearching ? (
                <span className="loading-spinner"></span>
              ) : (
                "Tìm kiếm"
              )}
            </button>
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setSearchTerm("");
                  // Reset về danh sách đầy đủ khi xóa từ khóa
                  (async () => {
                    try {
                      setLoading(true);
                      const data = await vaccineService.getVaccines();
                      setVaccines(data);
                      setError(null);
                    } catch (err) {
                      setError(
                        "Không thể tải dữ liệu vaccine. Vui lòng thử lại sau."
                      );
                    } finally {
                      setLoading(false);
                    }
                  })();
                }}
              >
                ×
              </button>
            )}
          </form>
        </div>

        <button className="create-button" onClick={handleCreateVaccine}>
          <FaPlus /> Tạo Vaccine Mới
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : !vaccines || vaccines.length === 0 ? (
        <div className="no-vaccines">Không tìm thấy vaccine nào phù hợp</div>
      ) : (
        <div className="vaccines-grid">
          {Array.isArray(vaccines) ? (
            vaccines.map((vaccine) => (
              <div key={vaccine.vaccineId} className="vaccine-card">
                <div className="vaccine-card-header">
                  <h3>{vaccine.name}</h3>
                  <span className="vaccine-id">{vaccine.vaccineId}</span>
                </div>

                <div className="vaccine-card-content">
                  <div className="vaccine-detail">
                    <FaInfoCircle className="icon" />
                    <p className="description">{vaccine.description}</p>
                  </div>

                  <div className="vaccine-detail-row">
                    <div className="vaccine-detail">
                      <FaSyringe className="icon" />
                      <p>{vaccine.manufacturer}</p>
                    </div>

                    <div className="vaccine-detail">
                      <FaArrowRight className="icon" />
                      <p>{vaccine.shotNumber} mũi</p>
                    </div>
                  </div>

                  <div className="vaccine-detail-row">
                    <div className="vaccine-detail">
                      <FaCalendarAlt className="icon" />
                      <p>Từ {vaccine.ageMonth} tháng tuổi</p>
                    </div>

                    <div className="vaccine-detail">
                      <FaBoxes className="icon" />
                      <p>{vaccine.quantity} liều</p>
                    </div>
                  </div>

                  <div className="vaccine-price">
                    <FaDollarSign className="icon" />
                    <p>{formatCurrency(vaccine.price)}</p>
                  </div>
                </div>

                <div className="vaccine-card-actions">
                  <button
                    className="update-quantity-button"
                    onClick={() => handleUpdateQuantity(vaccine)}
                  >
                    <FaBoxes /> Cập Nhật Số Lượng
                  </button>

                  <button
                    className="update-info-button"
                    onClick={() => handleUpdateInfo(vaccine)}
                  >
                    <FaEdit /> Cập Nhật Thông Tin
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div key={vaccines.vaccineId} className="vaccine-card">
              {/* Hiển thị một vaccine đơn lẻ nếu vaccines không phải là mảng */}
              <div className="vaccine-card-header">
                <h3>{vaccines.name}</h3>
                <span className="vaccine-id">{vaccines.vaccineId}</span>
              </div>
              {/* ... các phần còn lại ... */}
            </div>
          )}
        </div>
      )}

      {showCreateModal && <CreateVaccineModal />}
      {showUpdateModal && <UpdateVaccineModal />}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default VaccineManage;
