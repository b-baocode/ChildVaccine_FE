import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import adminService from '../../service/adminService';
import '../../styles/AdminStyles/StaffManagement.css';
import styles from '../../styles/AdminStyles/Modules/StaffManagement.module.css';


const CreateStaffModal = ({ newStaff, handleInputChange, handleCreateStaff, handleCloseModal, error }) => {
  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <h2>Thêm nhân viên mới</h2>
        {error && (
          <div className={styles['error-message']}>
            {error}
          </div>
        )}
        <form onSubmit={handleCreateStaff}>
          <div className={styles['form-group']}>
            <label>Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              value={newStaff.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={newStaff.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              value={newStaff.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Phòng ban:</label>
            <select
              name="department"
              value={newStaff.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn phòng ban</option>
              <option value="bán hàng">Bán hàng</option>
              <option value="quản lý">Quản lý</option>
              <option value="kế toán">Kế toán</option>
              <option value="nhân viên it">Nhân viên IT</option>
              <option value="nhân viên marketing">Nhân viên Marketing</option>
            </select>
          </div>
          <div className={styles['form-group']}>
            <label>Bằng cấp:</label>
            <input
              type="text"
              name="qualification"
              value={newStaff.qualification}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Chuyên môn:</label>
            <input
              type="text"
              name="specialization"
              value={newStaff.specialization}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={newStaff.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['modal-buttons']}>
            <button type="submit">Tạo</button>
            <button type="button" onClick={handleCloseModal}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const UpdateStaffModal = ({ staff, handleInputChange, handleUpdateStaff, handleCloseUpdateModal, error }) => {
  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <h2>Cập nhật thông tin nhân viên</h2>
        {error && (
          <div className={styles['error-message']}>
            {error}
          </div>
        )}
        <form onSubmit={handleUpdateStaff}>
          <div className={styles['form-group']}>
            <label>Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              value={staff.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={staff.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          <div className={styles['form-group']}>
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              value={staff.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Phòng ban:</label>
            <select
              name="department"
              value={staff.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn phòng ban</option>
              <option value="bán hàng">Bán hàng</option>
              <option value="quản lý">Quản lý</option>
              <option value="kế toán">Kế toán</option>
              <option value="nhân viên it">Nhân viên IT</option>
              <option value="nhân viên marketing">Nhân viên Marketing</option>
            </select>
          </div>
          <div className={styles['form-group']}>
            <label>Bằng cấp:</label>
            <input
              type="text"
              name="qualification"
              value={staff.qualification}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Chuyên môn:</label>
            <input
              type="text"
              name="specialization"
              value={staff.specialization}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles['modal-buttons']}>
            <button type="submit">Cập nhật</button>
            <button type="button" onClick={handleCloseUpdateModal}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <h2>Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa nhân viên này?</p>
        <div className={styles['modal-buttons']}>
          <button
            onClick={onConfirm}
            className={styles['delete-btn']}
          >
            Xóa
          </button>
          <button
            onClick={onCancel}
            className={styles['cancel-btn']}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [searchGender, setSearchGender] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    specialization: '',
    password: ''
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const data = await adminService.getAllStaffs();
        const formattedStaffList = data.map(staff => ({
          id: staff.id,
          name: staff.user.fullName,
          email: staff.user.email,
          phone: staff.user.phone,
          department: staff.department,
          hireDate: staff.hireDate,
          qualification: staff.qualification,
          specialization: staff.specialization,
          role: staff.user.role,
          active: staff.user.active
        }));
        setStaffList(formattedStaffList);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        setError('Failed to load staff data');
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePositionChange = (e) => {
    setSearchPosition(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSearchGender(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await adminService.createStaff(newStaff);

      // Show success message
      alert('Đăng ký nhân viên thành công!');
      const updatedData = await adminService.getAllStaffs();
      const formattedStaffList = updatedData.map(staff => ({
        id: staff.id,
        name: staff.user.fullName,
        email: staff.user.email,
        phone: staff.user.phone,
        department: staff.department,
        hireDate: staff.hireDate,
        qualification: staff.qualification,
        specialization: staff.specialization,
        role: staff.user.role,
        active: staff.user.active
      }));

      // Update the staff list with the new staff member
      setStaffList(formattedStaffList);

      // Close modal and reset form
      handleCloseModal();

    } catch (error) {
      console.error('Failed to create staff:', error);
      setCreateError(error.response?.data || 'Email đã tồn tại trong hệ thống');
    }
  };

  const filteredStaffList = staffList.filter(staff =>
    (staff.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) &&
    (searchPosition ? (staff.department?.toLowerCase() || '') === searchPosition.toLowerCase() : true)
  );

  const handleUpdate = (staff) => {
    setSelectedStaff({
      id: staff.id,
      fullName: staff.name,
      email: staff.email,
      phone: staff.phone,
      department: staff.department,
      qualification: staff.qualification,
      specialization: staff.specialization,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateStaff(selectedStaff.id, selectedStaff);

      // Fetch updated staff list
      const updatedData = await adminService.getAllStaffs();
      const formattedStaffList = updatedData.map(staff => ({
        id: staff.id,
        name: staff.user.fullName,
        email: staff.user.email,
        phone: staff.user.phone,
        department: staff.department,
        hireDate: staff.hireDate,
        qualification: staff.qualification,
        specialization: staff.specialization,
        role: staff.user.role,
        active: staff.user.active
      }));

      // Update state with new data
      setStaffList(formattedStaffList);
      setShowUpdateModal(false);
      setSelectedStaff(null);
      setUpdateError(null);

      // Show success message
      alert('Cập nhật thông tin nhân viên thành công!');
    } catch (error) {
      console.error('Failed to update staff:', error);
      setUpdateError(error.message || 'Không thể cập nhật thông tin nhân viên');
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedStaff(null);
    setUpdateError(null);
  };

  const handleDelete = (id) => {
    setStaffToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminService.deleteStaff(staffToDelete);

      // Fetch updated staff list
      const updatedData = await adminService.getAllStaffs();
      const formattedStaffList = updatedData.map(staff => ({
        id: staff.id,
        name: staff.user.fullName,
        email: staff.user.email,
        phone: staff.user.phone,
        department: staff.department,
        hireDate: staff.hireDate,
        qualification: staff.qualification,
        specialization: staff.specialization,
        role: staff.user.role,
        active: staff.user.active
      }));

      // Update state with new data
      setStaffList(formattedStaffList);

      // Show success message
      alert('Xóa nhân viên thành công!');
    } catch (error) {
      console.error('Failed to delete staff:', error);
      alert(error.message || 'Không thể xóa nhân viên');
    } finally {
      setShowDeleteModal(false);
      setStaffToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setStaffToDelete(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewStaff({
      fullName: '',
      email: '',
      phone: '',
      department: '',
      qualification: '',
      specialization: '',
      password: ''
    });
  };



  return (
    <div className="staff-management">
      <div className="header">
        <h1>Quản lý nhân viên</h1>
        <div className="search-bar">
          <div className="search-field">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="search-field">
            <select value={searchPosition} onChange={handlePositionChange}>
              <option value="">Tìm kiếm theo chức vụ</option>
              <option value="bán hàng">Bán hàng</option>
              <option value="quản lý">Quản lý</option>
              <option value="kế toán">Kế toán</option>
              <option value="nhân viên it">Nhân viên IT</option>
              <option value="nhân viên marketing">Nhân viên Marketing</option>
            </select>
          </div>
          <div className="search-field">
            <select value={searchGender} onChange={handleGenderChange}>
              <option value="">Tìm kiếm theo giới tính</option>
              <option value="nam">Nam</option>
              <option value="nữ">Nữ</option>
            </select>
          </div>
        </div>
      </div>
      <button
        className="create-staff-btn"
        onClick={() => setShowCreateModal(!showCreateModal)}
      >
        {showCreateModal ? '- Thêm nhân viên mới' : '+ Thêm nhân viên mới'}
      </button>


      <div className="staff-list">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredStaffList.length === 0 ? (
          <div>No staff members found</div>
        ) : (
          filteredStaffList.map((staff) => (
            <div key={staff.id} className="staff-card">
              <div className="staff-details">
                <h2>{staff.name}</h2>
                <p>ID: {staff.id}</p>
                <p>Email: {staff.email}</p>
                <p>Phone: {staff.phone}</p>
                <p>Department: {staff.department}</p>
                <p>Hire Date: {staff.hireDate}</p>
                <p>Qualification: {staff.qualification}</p>
                <p>Specialization: {staff.specialization}</p>
                <p>Role: {staff.role}</p>
                <p>Status: {staff.active ? 'Active' : 'Inactive'}</p>
                <button onClick={() => handleUpdate(staff)}>Cập nhật</button>
                <button onClick={() => handleDelete(staff.id)}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>
      {showCreateModal && (
        <CreateStaffModal
          newStaff={newStaff}
          handleInputChange={handleInputChange}
          handleCreateStaff={handleCreateStaff}
          handleCloseModal={handleCloseModal}
          error={createError}
        />
      )}
      {showUpdateModal && selectedStaff && (
        <UpdateStaffModal
          staff={selectedStaff}
          handleInputChange={(e) => {
            const { name, value } = e.target;
            setSelectedStaff(prev => ({
              ...prev,
              [name]: value
            }));
          }}
          handleUpdateStaff={handleUpdateStaff}
          handleCloseUpdateModal={handleCloseUpdateModal}
          error={updateError}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};



export default StaffManagement;