import React, { useState } from 'react';
import { 
  FaUser, 
  FaIdCard, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/CusStyles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('children');
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    phone: '',
    address: ''
  });

  // Mock data cho user
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyễn Văn A',
    id: 'USER123',
    email: 'nguyenvana@gmail.com',
    phone: '0912345678',
    address: '123 Đường ABC, Quận XYZ, TP.HCM'
  });

  // Mock data cho hồ sơ trẻ
  const children = [
    {
      id: 'CHILD001',
      name: 'Nguyễn Văn B',
      age: 5,
      birthday: '12/05/2019',
      healthStatus: 'Khỏe mạnh',
      currentConditions: 'Không có',
      pastConditions: 'Sốt xuất huyết (2022)'
    },
    {
      id: 'CHILD002',
      name: 'Nguyễn Thị C',
      age: 3,
      birthday: '20/08/2021',
      healthStatus: 'Đang theo dõi',
      currentConditions: 'Dị ứng thức ăn',
      pastConditions: 'Viêm phổi (2023)'
    }
  ];

  // Mock data cho lịch sử tiêm
  const vaccineHistory = [
    {
      childName: 'Nguyễn Văn B',
      vaccineName: 'Vaccine 6 trong 1',
      date: '10/03/2024',
      status: 'Hoàn thành',
      report: 'Phản ứng bình thường, không sốt'
    },
    {
      childName: 'Nguyễn Thị C',
      vaccineName: 'Vaccine Viêm gan B',
      date: '05/03/2024',
      status: 'Hoàn thành',
      report: 'Sốt nhẹ trong 24h đầu, sau đó ổn định'
    }
  ];

  // Xử lý cập nhật thông tin
  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({
      phone: userInfo.phone,
      address: userInfo.address
    });
  };

  const handleSave = () => {
    setUserInfo({
      ...userInfo,
      phone: editedInfo.phone,
      address: editedInfo.address
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddChild = () => {
    navigate('/add-child');
  };

  return (
    <div className="profile-container">
      {/* Left Section - User Info */}
      <div className="profile-sidebar">
        <div className="user-avatar">
          <img src="/default-avatar.png" alt="User Avatar" />
        </div>
        
        <div className="user-info">
          <div className="info-item name">
            <h2>{userInfo.name}</h2>
          </div>
          <div className="info-item">
            <FaIdCard className="info-icon" />
            <span>{userInfo.id}</span>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <span>{userInfo.email}</span>
          </div>
          
          {isEditing ? (
            <div className="edit-form">
              <div className="edit-item">
                <FaPhone className="info-icon" />
                <input
                  type="text"
                  value={editedInfo.phone}
                  onChange={(e) => setEditedInfo({...editedInfo, phone: e.target.value})}
                  placeholder="Số điện thoại"
                />
              </div>
              <div className="edit-item">
                <FaMapMarkerAlt className="info-icon" />
                <input
                  type="text"
                  value={editedInfo.address}
                  onChange={(e) => setEditedInfo({...editedInfo, address: e.target.value})}
                  placeholder="Địa chỉ"
                />
              </div>
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-btn">
                  <FaSave /> Lưu
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  <FaTimes /> Hủy
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{userInfo.phone}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <span>{userInfo.address}</span>
              </div>
              <button onClick={handleEdit} className="edit-btn">
                <FaEdit /> Cập nhật hồ sơ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Section - Content */}
      <div className="profile-content">
        <div className="content-header">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'children' ? 'active' : ''}`}
              onClick={() => setActiveTab('children')}
            >
              Hồ sơ trẻ
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Lịch sử tiêm chủng
            </button>
          </div>
        </div>

        {activeTab === 'children' ? (
          <>
            <div className="add-child-section">
              <button className="add-child-btn" onClick={handleAddChild}>
                <FaPlus /> Thêm hồ sơ trẻ
              </button>
            </div>
            <div className="children-list">
              {children.map(child => (
                <div key={child.id} className="child-card">
                  <div className="child-header">
                    <h3>{child.name}</h3>
                    <span className="child-id">ID: {child.id}</span>
                  </div>
                  <div className="child-info">
                    <div className="info-row">
                      <span>Tuổi: {child.age} tuổi</span>
                      <span>Ngày sinh: {child.birthday}</span>
                    </div>
                    <div className="info-row">
                      <span>Tình trạng: <span className={`health-status ${child.healthStatus === 'Khỏe mạnh' ? 'healthy' : 'monitoring'}`}>{child.healthStatus}</span></span>
                    </div>
                    <div className="info-row">
                      <span>Bệnh hiện tại: {child.currentConditions}</span>
                    </div>
                    <div className="info-row">
                      <span>Tiền sử bệnh: {child.pastConditions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="vaccine-history">
            {vaccineHistory.map((record, index) => (
              <div key={index} className="history-card">
                <div className="history-header">
                  <h3>{record.childName}</h3>
                  <span className={`status ${record.status.toLowerCase()}`}>{record.status}</span>
                </div>
                <div className="history-info">
                  <div className="info-row">
                    <span>Vaccine: {record.vaccineName}</span>
                    <span>Ngày tiêm: {record.date}</span>
                  </div>
                  <div className="info-row">
                    <span>Báo cáo: {record.report}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;