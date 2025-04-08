import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaSyringe,
  FaArchive,
  FaInfoCircle,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import packageService from "../../service/packageService";
import vaccineService from "../../service/vaccineService";
import "../../styles/AdminStyles/PackageManage.css";

const PackageManage = () => {
  const [packages, setPackages] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [packageVaccines, setPackageVaccines] = useState([]);
  const [loadingVaccines, setLoadingVaccines] = useState(false);

  const [packageVaccineCount, setPackageVaccineCount] = useState({});

  // Fetch packages và vaccines khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch danh sách gói vaccine
        const packagesData = await packageService.getAllPackages();
        setPackages(packagesData);

        // Fetch danh sách vaccine để dùng trong modal tạo/cập nhật
        const vaccinesData = await vaccineService.getVaccines();
        setVaccines(vaccinesData);

        // Thêm đoạn này: fetch số lượng vaccine cho mỗi gói
        const vaccineCountData = {};
        // Sử dụng Promise.all để fetch đồng thời, tăng tốc độ
        await Promise.all(
          packagesData.map(async (pkg) => {
            try {
              const vaccinesList = await packageService.getVaccinesInPackage(
                pkg.packageId
              );
              vaccineCountData[pkg.packageId] = vaccinesList.length;
            } catch (error) {
              console.error(
                `Lỗi khi lấy vaccine cho gói ${pkg.packageId}:`,
                error
              );
              vaccineCountData[pkg.packageId] = 0;
            }
          })
        );

        // Cập nhật state với số lượng vaccine cho tất cả các gói
        setPackageVaccineCount(vaccineCountData);
        console.log(
          "Đã fetch số lượng vaccine cho tất cả gói:",
          vaccineCountData
        );

        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Reset packageVaccines khi chọn package khác
    if (expandedPackage) {
      console.log("expandedPackage thay đổi:", expandedPackage);
      fetchPackageVaccines(expandedPackage);
    }
  }, [expandedPackage]);

  // Hiển thị thông báo
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Xử lý tạo gói vaccine mới
  const handleCreatePackage = () => {
    setShowCreateModal(true);
  };

  // Xử lý cập nhật gói vaccine
  const handleUpdatePackage = (packageData) => {
    setCurrentPackage(packageData);
    setShowUpdateModal(true);
  };

  // Trong useEffect hoặc trong hàm xử lý sự kiện mở rộng thông tin package
  const fetchPackageVaccines = async (packageId) => {
    setLoadingVaccines(true);
    console.log("Đang fetch vaccines cho gói:", packageId);
    try {
      const vaccinesList = await packageService.getVaccinesInPackage(packageId);
      console.log("Dữ liệu vaccines nhận được:", vaccinesList);
      setPackageVaccines(vaccinesList);

      // Lưu số lượng vaccine cho packageId này
      setPackageVaccineCount((prev) => {
        const updated = {
          ...prev,
          [packageId]: vaccinesList.length,
        };
        console.log("packageVaccineCount sau khi cập nhật:", updated);
        return updated;
      });
    } catch (error) {
      console.error("Không thể lấy danh sách vaccine:", error);
      showNotification("error", "Không thể tải thông tin chi tiết gói vaccine");

      setPackageVaccineCount((prev) => ({
        ...prev,
        [packageId]: 0,
      }));
    } finally {
      setLoadingVaccines(false);
    }
  };

  // Gọi khi click vào nút "Xem chi tiết"
  const handleExpandPackage = async (packageId) => {
    console.log("Click expand package với ID:", packageId);
    console.log("Trạng thái expandedPackage hiện tại:", expandedPackage);

    if (expandedPackage === packageId) {
      console.log("Thu gọn gói vaccine");
      setExpandedPackage(null);
      setPackageVaccines([]);
    } else {
      console.log("Mở rộng gói vaccine");
      setExpandedPackage(packageId);
      await fetchPackageVaccines(packageId);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      try {
        setLoading(true);
        const packagesData = await packageService.getAllPackages();
        setPackages(packagesData);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const data = await packageService.searchPackages(searchTerm);

      if (data) {
        if (Array.isArray(data)) {
          setPackages(data);
          if (data.length === 0) {
            showNotification("info", "Không tìm thấy gói vaccine phù hợp");
          } else {
            showNotification("success", `Tìm thấy ${data.length} gói vaccine`);
          }
        } else {
          setPackages([data]);
          showNotification("success", "Đã tìm thấy gói vaccine");
        }
      } else {
        setPackages([]);
        showNotification("info", "Không tìm thấy gói vaccine phù hợp");
      }

      setError(null);
    } catch (err) {
      setError("Không thể tìm kiếm. Vui lòng thử lại sau.");
      console.error("Lỗi khi tìm kiếm:", err);
      setPackages([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Format giá tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Modal tạo gói vaccine mới
  const CreatePackageModal = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedVaccines, setSelectedVaccines] = useState([]);
    const [vaccineSearchTerm, setVaccineSearchTerm] = useState("");
    const [filteredVaccines, setFilteredVaccines] = useState([]);
    const [isSearchingVaccine, setIsSearchingVaccine] = useState(false);

    useEffect(() => {
      setFilteredVaccines(vaccines);
    }, []);

    // Tìm kiếm vaccine
    const handleVaccineSearch = async (e) => {
      e.preventDefault();
      if (!vaccineSearchTerm.trim()) {
        // Nếu ô tìm kiếm trống, hiển thị tất cả vaccine
        setFilteredVaccines(vaccines);
        return;
      }

      try {
        setIsSearchingVaccine(true);
        const data = await vaccineService.getVaccinesByName(vaccineSearchTerm);

        // Xử lý dữ liệu trả về
        if (data) {
          if (Array.isArray(data)) {
            setFilteredVaccines(data);
          } else {
            setFilteredVaccines([data]);
          }
        } else {
          setFilteredVaccines([]);
        }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm vaccine:", err);
        // Lọc dữ liệu local nếu API bị lỗi
        const filtered = vaccines.filter((vaccine) =>
          vaccine.name.toLowerCase().includes(vaccineSearchTerm.toLowerCase())
        );
        setFilteredVaccines(filtered);
      } finally {
        setIsSearchingVaccine(false);
      }
    };

    // Tìm kiếm nhanh từ dữ liệu đã có khi gõ
    const handleSearchInputChange = (e) => {
      const term = e.target.value;
      setVaccineSearchTerm(term);

      // Tìm kiếm cục bộ từ danh sách hiện có
      if (!term.trim()) {
        setFilteredVaccines(vaccines);
      } else {
        const filtered = vaccines.filter((vaccine) =>
          vaccine.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredVaccines(filtered);
      }
    };

    // Trong hàm handleSubmit của UpdatePackageModal
    // Cập nhật phương thức handleSubmit trong CreatePackageModal
    const handleSubmit = async (e) => {
      e.preventDefault();

      const formElements = e.target.elements;

      // Kiểm tra có chọn ít nhất 1 vaccine chưa
      if (selectedVaccines.length === 0) {
        showNotification("error", "Phải chọn ít nhất 1 vaccine cho gói");
        return;
      }

      try {
        setIsSubmitting(true);

        // Chỉ gửi các trường name, description và vaccineIds
        const packageData = {
          name: formElements.name.value,
          description: formElements.description.value,
          vaccineIds: selectedVaccines,
          available: 1, // Giữ lại vì cần cho API
        };

        await packageService.createPackage(packageData);

        // Cập nhật lại danh sách gói vaccine
        const packagesData = await packageService.getAllPackages();
        setPackages(packagesData);

        setShowCreateModal(false);
        showNotification("success", "Tạo gói vaccine mới thành công!");
      } catch (error) {
        console.error("Lỗi khi tạo gói vaccine:", error);
        showNotification(
          "error",
          `Lỗi: ${error.message || "Không thể tạo gói vaccine"}`
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleVaccineSelection = (vaccineId) => {
      setSelectedVaccines((prevSelected) => {
        if (prevSelected.includes(vaccineId)) {
          return prevSelected.filter((id) => id !== vaccineId);
        } else {
          return [...prevSelected, vaccineId];
        }
      });
    };

    return (
      <div className="package-modal">
        <div className="package-modal-content">
          <h2>Tạo Gói Vaccine Mới</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên gói vaccine:</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Nhập tên gói vaccine..."
              />
            </div>

            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Mô tả chi tiết về gói vaccine..."
              />
            </div>

            <div className="form-group">
              <label>Chọn vaccine cho gói:</label>

              {/* Thêm thanh tìm kiếm vaccine */}
              <div className="vaccine-search-container">
                <form
                  onSubmit={handleVaccineSearch}
                  className="vaccine-search-form"
                >
                  <input
                    type="text"
                    value={vaccineSearchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Tìm kiếm vaccine theo tên..."
                    className="vaccine-search-input"
                  />
                  <button type="submit" className="vaccine-search-button">
                    {isSearchingVaccine ? (
                      <span className="loading-spinner-sm"></span>
                    ) : (
                      "Tìm"
                    )}
                  </button>
                  {vaccineSearchTerm && (
                    <button
                      type="button"
                      className="clear-vaccine-search"
                      onClick={() => {
                        setVaccineSearchTerm("");
                        setFilteredVaccines(vaccines);
                      }}
                    >
                      ×
                    </button>
                  )}
                </form>
              </div>

              <div className="vaccines-selection">
                {filteredVaccines.length > 0 ? (
                  filteredVaccines.map((vaccine) => (
                    <div key={vaccine.vaccineId} className="vaccine-checkbox">
                      <input
                        type="checkbox"
                        id={`vaccine-${vaccine.vaccineId}`}
                        checked={selectedVaccines.includes(vaccine.vaccineId)}
                        onChange={() =>
                          handleVaccineSelection(vaccine.vaccineId)
                        }
                      />
                      <label htmlFor={`vaccine-${vaccine.vaccineId}`}>
                        {vaccine.name} - {formatCurrency(vaccine.price)}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="no-vaccines-found">
                    Không tìm thấy vaccine phù hợp
                  </p>
                )}
              </div>
              {selectedVaccines.length > 0 && (
                <div className="selected-count">
                  Đã chọn {selectedVaccines.length} vaccine
                </div>
              )}
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
                {isSubmitting ? "Đang tạo..." : "Tạo Gói Vaccine"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal cập nhật gói vaccine
  const UpdatePackageModal = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedVaccines, setSelectedVaccines] = useState(
      currentPackage?.vaccines?.map((v) => v.vaccineId) || []
    );
    const [vaccineSearchTerm, setVaccineSearchTerm] = useState("");
    const [filteredVaccines, setFilteredVaccines] = useState([]);
    const [isSearchingVaccine, setIsSearchingVaccine] = useState(false);

    useEffect(() => {
      if (currentPackage?.vaccines) {
        setSelectedVaccines(currentPackage.vaccines.map((v) => v.vaccineId));
      }
      setFilteredVaccines(vaccines);
    }, [currentPackage, vaccines]);

    const handleVaccineSearch = async (e) => {
      e.preventDefault();
      if (!vaccineSearchTerm.trim()) {
        // Nếu ô tìm kiếm trống, hiển thị tất cả vaccine
        setFilteredVaccines(vaccines);
        return;
      }

      try {
        setIsSearchingVaccine(true);
        const data = await vaccineService.getVaccinesByName(vaccineSearchTerm);

        // Xử lý dữ liệu trả về
        if (data) {
          if (Array.isArray(data)) {
            setFilteredVaccines(data);
          } else {
            setFilteredVaccines([data]);
          }
        } else {
          setFilteredVaccines([]);
        }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm vaccine:", err);
        // Lọc dữ liệu local nếu API bị lỗi
        const filtered = vaccines.filter((vaccine) =>
          vaccine.name.toLowerCase().includes(vaccineSearchTerm.toLowerCase())
        );
        setFilteredVaccines(filtered);
      } finally {
        setIsSearchingVaccine(false);
      }
    };

    // Tìm kiếm nhanh từ dữ liệu đã có khi gõ
    const handleSearchInputChange = (e) => {
      const term = e.target.value;
      setVaccineSearchTerm(term);

      // Tìm kiếm cục bộ từ danh sách hiện có
      if (!term.trim()) {
        setFilteredVaccines(vaccines);
      } else {
        const filtered = vaccines.filter((vaccine) =>
          vaccine.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredVaccines(filtered);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const formElements = e.target.elements;

      try {
        setIsSubmitting(true);

        // Chuẩn bị dữ liệu với name, description và vaccineIds (có thể rỗng)
        const packageData = {
          name: formElements.name.value,
          description: formElements.description.value,
          vaccineIds: selectedVaccines, // Không cần kiểm tra nữa, có thể rỗng
        };

        // Cập nhật thông tin gói - CHÚ Ý: Đang sửa lỗi này
        // Thay vì chỉ gửi selectedVaccines, gửi cả đối tượng packageData
        await packageService.updatePackageVaccines(
          currentPackage.packageId,
          packageData
        );

        // Cập nhật lại danh sách gói vaccine
        const packagesData = await packageService.getAllPackages();
        setPackages(packagesData);

        setShowUpdateModal(false);
        showNotification("success", "Cập nhật gói vaccine thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật gói vaccine:", error);
        showNotification(
          "error",
          `Lỗi: ${error.message || "Không thể cập nhật gói vaccine"}`
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleVaccineSelection = (vaccineId) => {
      setSelectedVaccines((prevSelected) => {
        if (prevSelected.includes(vaccineId)) {
          return prevSelected.filter((id) => id !== vaccineId);
        } else {
          return [...prevSelected, vaccineId];
        }
      });
    };

    if (!currentPackage) return null;

    return (
      <div className="package-modal">
        <div className="package-modal-content">
          <h2>Cập Nhật Gói Vaccine</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên gói vaccine:</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={currentPackage.name}
              />
            </div>

            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                name="description"
                rows={4}
                required
                defaultValue={currentPackage.description}
              />
            </div>

            <div className="form-group">
              <label>Chọn vaccine cho gói:</label>

              {/* Thêm thanh tìm kiếm vaccine */}
              <div className="vaccine-search-container">
                <form
                  onSubmit={handleVaccineSearch}
                  className="vaccine-search-form"
                >
                  <input
                    type="text"
                    value={vaccineSearchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Tìm kiếm vaccine theo tên..."
                    className="vaccine-search-input"
                  />
                  <button type="submit" className="vaccine-search-button">
                    {isSearchingVaccine ? (
                      <span className="loading-spinner-sm"></span>
                    ) : (
                      "Tìm"
                    )}
                  </button>
                  {vaccineSearchTerm && (
                    <button
                      type="button"
                      className="clear-vaccine-search"
                      onClick={() => {
                        setVaccineSearchTerm("");
                        setFilteredVaccines(vaccines);
                      }}
                    >
                      ×
                    </button>
                  )}
                </form>
              </div>

              <div className="vaccines-selection">
                {filteredVaccines.length > 0 ? (
                  filteredVaccines.map((vaccine) => (
                    <div key={vaccine.vaccineId} className="vaccine-checkbox">
                      <input
                        type="checkbox"
                        id={`update-vaccine-${vaccine.vaccineId}`}
                        checked={selectedVaccines.includes(vaccine.vaccineId)}
                        onChange={() =>
                          handleVaccineSelection(vaccine.vaccineId)
                        }
                      />
                      <label htmlFor={`update-vaccine-${vaccine.vaccineId}`}>
                        {vaccine.name} - {formatCurrency(vaccine.price)}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="no-vaccines-found">
                    Không tìm thấy vaccine phù hợp
                  </p>
                )}
              </div>
              {selectedVaccines.length > 0 && (
                <div className="selected-count">
                  Đã chọn {selectedVaccines.length} vaccine
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="cancel-button"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập Nhật Gói Vaccine"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render danh sách gói vaccine
  const renderPackages = () => {
    if (!packages || packages.length === 0) {
      return <div className="no-packages">Không tìm thấy gói vaccine nào</div>;
    }

    console.log("Giá trị packageVaccineCount hiện tại:", packageVaccineCount);

    return (
      <div className="packages-grid">
        {packages.map((packageItem) => {
          return (
            <div key={packageItem.packageId} className="package-card">
              <div className="package-card-header">
                <h3>{packageItem.name}</h3>
                <span className="package-id">{packageItem.packageId}</span>
              </div>

              <div className="package-card-content">
                <div className="package-detail">
                  <FaInfoCircle className="icon" />
                  <p className="description">{packageItem.description}</p>
                </div>

                <div className="package-detail-row">
                  <div className="package-detail">
                    <FaArchive className="icon" />
                    <p>
                      Gồm{" "}
                      {
                        // Nếu đã load thông tin vaccine của gói này thì hiển thị số lượng thật
                        // Nếu chưa thì hiển thị "? loại vaccine" để chỉ ra chưa có thông tin
                        packageVaccineCount[packageItem.packageId] !== undefined
                          ? `${
                              packageVaccineCount[packageItem.packageId]
                            } loại vaccine`
                          : "? loại vaccine"
                      }
                    </p>
                  </div>
                </div>

                <div className="package-price">
                  <FaDollarSign className="icon" />
                  <p>{formatCurrency(packageItem.price)}</p>
                </div>

                <button
                  className={`package-detail-toggle ${
                    expandedPackage === packageItem.packageId ? "active" : ""
                  }`}
                  onClick={() => handleExpandPackage(packageItem.packageId)}
                >
                  {expandedPackage === packageItem.packageId
                    ? "Thu gọn chi tiết"
                    : "Xem chi tiết vaccine"}
                </button>

                {expandedPackage === packageItem.packageId && (
                  <div className="package-vaccines-list">
                    <h4>Danh sách vaccine trong gói:</h4>

                    {loadingVaccines ? (
                      <p className="loading-text">
                        Đang tải danh sách vaccine...
                      </p>
                    ) : packageVaccines && packageVaccines.length > 0 ? (
                      <ul>
                        {packageVaccines.map((vaccine) => (
                          <li key={vaccine.vaccineId}>
                            <FaSyringe className="vaccine-icon" />
                            <span className="vaccine-name">{vaccine.name}</span>
                            <span className="vaccine-price">
                              {formatCurrency(vaccine.price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-vaccines-text">
                        Không có vaccine nào trong gói này
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="package-card-actions">
                <button
                  className="update-package-button"
                  onClick={() => handleUpdatePackage(packageItem)}
                >
                  <FaEdit /> Cập Nhật Gói
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="package-manage-container">
      <div className="package-header">
        <h1 className="green-title">Quản Lý Gói Vaccine</h1>

        <div className="package-search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm gói vaccine theo tên..."
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
                  (async () => {
                    try {
                      setLoading(true);
                      const data = await packageService.getAllPackages();
                      setPackages(data);
                      setError(null);
                    } catch (err) {
                      setError(
                        "Không thể tải dữ liệu gói vaccine. Vui lòng thử lại sau."
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

        <button className="create-button" onClick={handleCreatePackage}>
          <FaPlus /> Tạo Gói Vaccine Mới
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        renderPackages()
      )}

      {showCreateModal && <CreatePackageModal />}
      {showUpdateModal && <UpdatePackageModal />}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default PackageManage;
