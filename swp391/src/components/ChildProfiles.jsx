import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/ChildProfiles.css';

function ChildProfiles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [childProfiles, setChildProfiles] = useState([
    {
      id: 'CH001',
      name: 'Nguyễn Văn B',
      dob: '2015-05-01',
      gender: 'Nam',
      height: '120 cm',
      weight: '25 kg',
      vaccinations: [
        {
          id: 1,
          appointment_id: 'APP001',
          appointment_date: '2024-03-15',
          symptoms: 'Sốt nhẹ, đau tại chỗ tiêm',
          notes: 'Theo dõi 30 phút sau tiêm, không có biến chứng'
        },
        {
          id: 2,
          appointment_id: 'APP002',
          appointment_date: '2024-02-10',
          symptoms: 'Không có triệu chứng bất thường',
          notes: 'Tiêm chủng thành công'
        }
      ]
    },
    {
      id: 'CH002',
      name: 'Trần Thị C',
      dob: '2016-06-02',
      gender: 'Nữ',
      height: '115 cm',
      weight: '22 kg',
      vaccinations: [
        {
          date: '2024-03-16',
          vaccine: 'Viêm gan B',
          location: 'VNVC Quận 2',
          doctor: 'BS. Lê Văn M',
          nextDose: '2024-09-16'
        },
        {
          date: '2024-01-20',
          vaccine: 'Sởi - Quai bị - Rubella',
          location: 'VNVC Quận 2',
          doctor: 'BS. Phạm Thị N',
          nextDose: '2024-07-20'
        },
        {
          date: '2023-11-05',
          vaccine: 'Thủy đậu',
          location: 'VNVC Quận 2',
          doctor: 'BS. Lê Văn M',
          nextDose: '2024-05-05'
        }
      ]
    },
    {
      id: 'CH003',
      name: 'Lê Văn D',
      dob: '2017-07-03',
      gender: 'Nam',
      height: '110 cm',
      weight: '20 kg',
      vaccinations: [
        {
          date: '2024-03-17',
          vaccine: 'Cúm mùa',
          location: 'VNVC Quận 5',
          doctor: 'BS. Hoàng Văn P',
          nextDose: '2024-09-17'
        },
        {
          date: '2024-02-01',
          vaccine: 'Viêm não Nhật Bản',
          location: 'VNVC Quận 5',
          doctor: 'BS. Nguyễn Thị Q',
          nextDose: '2024-08-01'
        }
      ]
    },
    {
      id: 'CH004',
      name: 'Phạm Thị E',
      dob: '2018-08-04',
      gender: 'Nữ',
      height: '105 cm',
      weight: '18 kg',
      vaccinations: [
        {
          date: '2024-03-18',
          vaccine: 'HPV',
          location: 'VNVC Quận 7',
          doctor: 'BS. Trần Văn R',
          nextDose: '2024-09-18'
        },
        {
          date: '2024-01-15',
          vaccine: 'Viêm gan A',
          location: 'VNVC Quận 7',
          doctor: 'BS. Lê Thị S',
          nextDose: '2024-07-15'
        },
        {
          date: '2023-12-20',
          vaccine: 'Phế cầu',
          location: 'VNVC Quận 7',
          doctor: 'BS. Trần Văn R',
          nextDose: '2024-06-20'
        }
      ]
    }
  ]);

  const [showReactions, setShowReactions] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);

  // Thêm state để quản lý modal bệnh án
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);

  // Thêm state để quản lý chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    height: '',
    weight: '',
    healthNote: ''
  });

  // Thêm state để quản lý modal xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  // Thêm state mới
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [selectedChildVaccinations, setSelectedChildVaccinations] = useState(null);

  // Cập nhật mock data để thêm thông tin mới
  const medicalRecords = {
    'CH001': {
      basicInfo: {
        height: 120.5,
        weight: 25.3,
        bloodType: 'A+',
        allergies: 'Dị ứng đậu phộng, hải sản',
        healthNote: 'Trẻ có tiền sử hen suyễn nhẹ'
      }
    }
  };

  useEffect(() => {
    if (!user) {
      setShowLoginDialog(true);
    }
  }, [user]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCloseDialog = () => {
    setShowLoginDialog(false);
    navigate('/');
  };

  // Thêm hàm xử lý chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({
      height: selectedMedicalRecord.basicInfo.height,
      weight: selectedMedicalRecord.basicInfo.weight,
      healthNote: selectedMedicalRecord.basicInfo.healthNote
    });
  };

  const handleSave = () => {
    // Cập nhật dữ liệu (trong thực tế sẽ gọi API)
    selectedMedicalRecord.basicInfo = {
      ...selectedMedicalRecord.basicInfo,
      height: editedInfo.height,
      weight: editedInfo.weight,
      healthNote: editedInfo.healthNote
    };
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Thêm hàm xử lý xóa
  const handleDelete = (profileId) => {
    setProfileToDelete(profileId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    // Trong thực tế sẽ gọi API để xóa
    const newProfiles = childProfiles.filter(profile => profile.id !== profileToDelete);
    setChildProfiles(newProfiles);
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

  if (showLoginDialog) {
    return (
      <div className="login-dialog-overlay">
        <div className="login-dialog">
          <h2>Yêu cầu đăng nhập</h2>
          <p>Vui lòng đăng nhập để xem hồ sơ trẻ em</p>
          <div className="dialog-buttons">
            <button className="login-btn" onClick={handleLoginClick}>
              Đăng nhập
            </button>
            <button className="cancel-btn" onClick={handleCloseDialog}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="child-profiles-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Quay lại trang chủ
        </button>
        <h1>Hồ Sơ Trẻ Em</h1>
        <button className="add-profile-btn" onClick={() => navigate('/add-child')}>
          + Thêm Hồ Sơ Mới
        </button>
      </div>

      <div className="profiles-container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Danh sách buổi tiêm</th>
                <th>Hồ sơ bệnh án</th>
              </tr>
            </thead>
            <tbody>
              {childProfiles.map((profile) => (
                <React.Fragment key={profile.id}>
                  <tr className="profile-row">
                    <td>{profile.id}</td>
                    <td>{profile.name}</td>
                    <td>{profile.dob}</td>
                    <td>{profile.gender}</td>
                    <td>
                      <button
                        className="view-vaccinations-btn"
                        onClick={() => {
                          setSelectedChildVaccinations(profile);
                          setShowVaccinationModal(true);
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-medical-btn"
                          onClick={() => {
                            setSelectedMedicalRecord(medicalRecords[profile.id]);
                            setShowMedicalRecord(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                        <button
                          className="delete-profile-btn"
                          onClick={() => handleDelete(profile.id)}
                        >
                          <FaTrash /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReactions && selectedVaccination && (
        <div className="reactions-modal-overlay">
          <div className="reactions-modal">
            <div className="reactions-modal-header">
              <h3>Phản ứng sau tiêm - {selectedVaccination.vaccine}</h3>
              <button
                className="close-modal-btn"
                onClick={() => {
                  setShowReactions(false);
                  setSelectedVaccination(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="reactions-modal-content">
              {selectedVaccination.reactions && selectedVaccination.reactions.length > 0 ? (
                <table className="reactions-table">
                  <thead>
                    <tr>
                      <th>Triệu chứng</th>
                      <th>Mức độ</th>
                      <th>Thời gian</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVaccination.reactions.map((reaction, index) => (
                      <tr key={index}>
                        <td>{reaction.symptom}</td>
                        <td>
                          <span className={`severity-badge ${reaction.severity.toLowerCase()}`}>
                            {reaction.severity}
                          </span>
                        </td>
                        <td>{reaction.duration}</td>
                        <td>{reaction.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-reactions">Không ghi nhận phản ứng sau tiêm</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showMedicalRecord && selectedMedicalRecord && (
        <div className="medical-modal-overlay">
          <div className="medical-modal">
            <div className="medical-modal-header">
              <h3>Hồ sơ bệnh án</h3>
              <button
                className="close-modal-btn"
                onClick={() => {
                  setShowMedicalRecord(false);
                  setSelectedMedicalRecord(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="medical-modal-content">
              <div className="medical-basic-info">
                <div className="basic-info-header">
                  <h4>Thông tin cơ bản</h4>
                  {!isEditing ? (
                    <button className="edit-medical-btn" onClick={handleEdit}>
                      <FaEdit /> Sửa hồ sơ
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button className="save-medical-btn" onClick={handleSave}>
                        <FaSave /> Lưu
                      </button>
                      <button className="cancel-medical-btn" onClick={handleCancel}>
                        <FaTimes /> Hủy
                      </button>
                    </div>
                  )}
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Chiều cao:</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editedInfo.height}
                        onChange={(e) => setEditedInfo({...editedInfo, height: e.target.value})}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedMedicalRecord.basicInfo.height} cm</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Cân nặng:</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editedInfo.weight}
                        onChange={(e) => setEditedInfo({...editedInfo, weight: e.target.value})}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedMedicalRecord.basicInfo.weight} kg</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Nhóm máu:</label>
                    <span>{selectedMedicalRecord.basicInfo.bloodType}</span>
                  </div>
                  <div className="info-item">
                    <label>Dị ứng:</label>
                    <span>{selectedMedicalRecord.basicInfo.allergies || 'Không có'}</span>
                  </div>
                  <div className="info-item full-width">
                    <label>Ghi chú sức khỏe:</label>
                    {isEditing ? (
                      <textarea
                        value={editedInfo.healthNote}
                        onChange={(e) => setEditedInfo({...editedInfo, healthNote: e.target.value})}
                        className="edit-input"
                        rows="3"
                      />
                    ) : (
                      <span>{selectedMedicalRecord.basicInfo.healthNote || 'Không có'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Xác nhận xóa hồ sơ</h3>
            <p>
              Bạn có chắc chắn muốn xóa hồ sơ này không?<br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="confirm-actions">
              <button className="confirm-delete-btn" onClick={handleConfirmDelete}>
                <FaTrash /> Xóa hồ sơ
              </button>
              <button className="cancel-delete-btn" onClick={handleCancelDelete}>
                <FaTimes /> Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showVaccinationModal && selectedChildVaccinations && (
        <div className="medical-modal-overlay">
          <div className="medical-modal">
            <div className="medical-modal-header">
              <h3>Lịch sử tiêm chủng - {selectedChildVaccinations.name}</h3>
              <button
                className="close-modal-btn"
                onClick={() => {
                  setShowVaccinationModal(false);
                  setSelectedChildVaccinations(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="medical-modal-content">
              {selectedChildVaccinations.vaccinations && selectedChildVaccinations.vaccinations.length > 0 ? (
                <table className="vaccinations-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mã cuộc hẹn</th>
                      <th>Ngày tiêm</th>
                      <th>Triệu chứng sau tiêm</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChildVaccinations.vaccinations.map((vaccination) => (
                      <tr key={vaccination.id}>
                        <td>{vaccination.id}</td>
                        <td>{vaccination.appointment_id}</td>
                        <td>{vaccination.appointment_date}</td>
                        <td>{vaccination.symptoms || 'Không có'}</td>
                        <td>{vaccination.notes || 'Không có'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-vaccinations">Chưa có lịch sử tiêm chủng</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChildProfiles;