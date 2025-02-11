import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
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
          date: '2024-03-15',
          vaccine: 'Covid-19',
          location: 'VNVC Quận 1',
          doctor: 'BS. Nguyễn Văn X',
          nextDose: '2024-09-15',
          reactions: [
            {
              symptom: 'Sốt nhẹ',
              severity: 'Nhẹ',
              duration: '24 giờ',
              note: 'Đã dùng thuốc hạ sốt'
            },
            {
              symptom: 'Đau tại chỗ tiêm',
              severity: 'Nhẹ',
              duration: '48 giờ',
              note: 'Tự khỏi sau 2 ngày'
            }
          ]
        },
        {
          date: '2023-12-10',
          vaccine: 'Viêm gan B',
          location: 'VNVC Quận 3',
          doctor: 'BS. Trần Thị Y',
          nextDose: '2024-06-10'
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
                <th>Chiều cao</th>
                <th>Cân nặng</th>
                <th>Danh sách buổi tiêm</th>
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
                    <td>{profile.height}</td>
                    <td>{profile.weight}</td>
                    <td>
                      <button
                        className="view-vaccinations-btn"
                        onClick={() => {
                          const row = document.querySelector(`#vaccinations-${profile.id}`);
                          row.classList.toggle('show');
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                  <tr id={`vaccinations-${profile.id}`} className="vaccinations-row">
                    <td colSpan="7">
                      <div className="vaccinations-details">
                        <h4>Lịch sử tiêm chủng</h4>
                        {profile.vaccinations && profile.vaccinations.length > 0 ? (
                          <table className="vaccinations-table">
                            <thead>
                              <tr>
                                <th>Ngày tiêm</th>
                                <th>Vaccine</th>
                                <th>Địa điểm tiêm</th>
                                <th>Bác sĩ tiêm</th>
                                <th>Ngày tiêm mũi tiếp theo</th>
                                <th>Phản ứng sau tiêm</th>
                              </tr>
                            </thead>
                            <tbody>
                              {profile.vaccinations.map((vaccination, index) => (
                                <tr key={index}>
                                  <td>{vaccination.date}</td>
                                  <td>{vaccination.vaccine}</td>
                                  <td>{vaccination.location}</td>
                                  <td>{vaccination.doctor}</td>
                                  <td>{vaccination.nextDose}</td>
                                  <td>
                                    <button
                                      className="view-reactions-btn"
                                      onClick={() => {
                                        setSelectedVaccination(vaccination);
                                        setShowReactions(true);
                                      }}
                                    >
                                      Xem chi tiết
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="no-vaccinations">Chưa có lịch sử tiêm chủng</p>
                        )}
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
    </div>
  );
}

export default ChildProfiles;