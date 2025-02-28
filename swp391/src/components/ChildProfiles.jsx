import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/ChildProfiles.css';
import sessionService from '../service/sessionService';
import customerService from '../service/customerService';
import childService from '../service/childService'; // Import childService

function ChildProfiles() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data States
  const [childProfiles, setChildProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);

  // Selected Item States
  const [selectedChildVaccinations, setSelectedChildVaccinations] = useState(null);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);
  const [profileToDelete, setProfileToDelete] = useState(null);

  const [showReactions, setShowReactions] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    height: '',
    weight: '',
    healthNote: ''
  });

  useEffect(() => {
    const fetchChildProfiles = async () => {
      try {
        setLoading(true);
        const sessionData = await sessionService.checkSession();
        
        if (sessionData) {
          const children = await customerService.getCustomerChildren(sessionData.cusId);
          const transformedChildren = children.map(child => ({
            id: child.childId,
            name: child.fullName,
            dob: child.dateOfBirth,
            gender: child.gender === 'MALE' ? 'Nam' : 'Nữ',
            height: `${child.height} cm`,
            weight: `${child.weight} kg`,
            medicalInfo: {
              bloodType: child.bloodType,
              allergies: child.allergies || 'Không có',
              healthNote: child.healthNote || 'Không có'
            },
            vaccinations: [] // This will be populated when you implement vaccination history
          }));
          
          setChildProfiles(transformedChildren);
        }
      } catch (err) {
        console.error('Error fetching child profiles:', err);
        setError('Không thể tải thông tin hồ sơ trẻ');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChildProfiles();
    } else {
      setShowLoginDialog(true);
    }
  }, [user]);

  const getMedicalRecord = (childId) => {
    const child = childProfiles.find(profile => profile.id === childId);
    if (!child) return null;
  
    return {
      id: child.id,
      basicInfo: {
        height: parseFloat(child.height) || '', // Ensure numeric or empty for input
        weight: parseFloat(child.weight) || '', // Ensure numeric or empty for input
        bloodType: child.medicalInfo.bloodType,
        allergies: child.medicalInfo.allergies,
        healthNote: child.medicalInfo.healthNote
      }
    };
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCloseDialog = () => {
    setShowLoginDialog(false);
    navigate('/');
  };

  const handleEdit = () => {
    if (!selectedMedicalRecord) return;
  
    setIsEditing(true);
    setEditedInfo({
      height: selectedMedicalRecord.basicInfo.height || '',
      weight: selectedMedicalRecord.basicInfo.weight || '',
      healthNote: selectedMedicalRecord.basicInfo.healthNote || ''
    });
  };

  const handleSave = async () => {
    try {
      const sessionData = await sessionService.checkSession();
      if (!sessionData) throw new Error('No session data found');

      // Prepare data for the API call (only send fields that can be updated)
      const updateData = {
        height: parseFloat(editedInfo.height) || 0, // Ensure numeric values
        weight: parseFloat(editedInfo.weight) || 0, // Ensure numeric values
        healthNote: editedInfo.healthNote || '' // Ensure string or empty
      };

      // Call the backend API to update the child profile
      await childService.updateChildProfile(selectedMedicalRecord.id, updateData);

      // Update the local state with the new data
      const updatedProfiles = childProfiles.map(profile => {
        if (profile.id === selectedMedicalRecord.id) {
          return {
            ...profile,
            height: `${editedInfo.height} cm`,
            weight: `${editedInfo.weight} kg`,
            medicalInfo: {
              ...profile.medicalInfo,
              healthNote: editedInfo.healthNote
            }
          };
        }
        return profile;
      });

      setChildProfiles(updatedProfiles);
      setIsEditing(false);
      setShowMedicalRecord(false);
      setSelectedMedicalRecord(null);
    } catch (error) {
      console.error('Error updating medical record:', error);
      setError('Cập nhật thông tin trẻ thất bại: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo({
      height: '',
      weight: '',
      healthNote: ''
    });
  };

  const handleDelete = async (childId) => {
    console.error('Error preparing to delete child profile:'); // Placeholder for now
  };

  const handleConfirmDelete = async () => {
    try {
      const sessionData = await sessionService.checkSession();
      if (!sessionData) throw new Error('No session data found');
  
      const newProfiles = childProfiles.filter(profile => profile.id !== profileToDelete);
      setChildProfiles(newProfiles);
      setShowDeleteConfirm(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error('Error deleting child profile:', error);
      setError('Failed to delete profile');
    }
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
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
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
                    <tr key={profile.id} className="profile-row">
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
                              setSelectedMedicalRecord(getMedicalRecord(profile.id));
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
                  setIsEditing(false); // Reset editing state when closing
                  setEditedInfo({ height: '', weight: '', healthNote: '' }); // Reset edited info
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
                        <FaSave /> LƯU
                      </button>
                      <button className="cancel-medical-btn" onClick={handleCancel}>
                        <FaTimes /> HỦY
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
                        onChange={(e) => setEditedInfo({ ...editedInfo, height: e.target.value })}
                        className="edit-input"
                        placeholder="Chiều cao (cm)"
                      />
                    ) : (
                      <span>{selectedMedicalRecord.basicInfo.height || 0} cm</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Cân nặng:</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editedInfo.weight}
                        onChange={(e) => setEditedInfo({ ...editedInfo, weight: e.target.value })}
                        className="edit-input"
                        placeholder="Cân nặng (kg)"
                      />
                    ) : (
                      <span>{selectedMedicalRecord.basicInfo.weight || 0} kg</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Nhóm máu:</label>
                    <span>{selectedMedicalRecord.basicInfo.bloodType || 'Không có'}</span>
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
                        onChange={(e) => setEditedInfo({ ...editedInfo, healthNote: e.target.value })}
                        className="edit-input"
                        rows="3"
                        placeholder="Ghi chú sức khỏe..."
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