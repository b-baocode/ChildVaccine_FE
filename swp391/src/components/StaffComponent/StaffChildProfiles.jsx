import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaNotesMedical, FaRuler, FaWeight, FaSearch } from 'react-icons/fa';
import childService from '../../service/childService';
import '../../styles/StaffStyles/StaffChildProfiles.css';


const StaffChildProfile = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [childData, setChildData] = useState(null);
    const [childrenProfiles, setChildrenProfiles] = useState([]);
    const [childMedicalRecords, setChildMedicalRecords] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(id || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchChildren = async () => {
          try {
              setLoading(true);
              const data = await childService.getAllChildren();
  
              const transformedData = data.map(child => ({
                  child_id: child.childId,
                  cus_id: child.customerId,
                  full_name: child.fullName,
                  date_of_birth: child.dateOfBirth,
                  gender: child.gender === 'MALE' ? 'Nam' : 
                         child.gender === 'FEMALE' ? 'Nữ' : 'Khác',
                  height: child.height || 0,
                  weight: child.weight || 0,
                  blood_type: child.bloodType || 'Chưa xác định',
                  allergies: child.allergies || 'Không',
                  health_note: child.healthNote || 'Không có ghi chú'
              }));
  
              console.log('Transformed children data:', transformedData);
              setChildrenProfiles(transformedData);
              
              // Chỉ set selectedChildId nếu chưa có giá trị
              if (!selectedChildId && transformedData.length > 0) {
                  setSelectedChildId(transformedData[0].child_id);
              }
          } catch (err) {
              console.error('Error fetching children:', err);
              setError('Không thể tải danh sách trẻ');
          } finally {
              setLoading(false);
          }
      };
  
      fetchChildren();
    }, []);// Empty dependency array as this should only run once on mount

  // Second useEffect to handle selected child changes
  useEffect(() => {
    if (!selectedChildId && childrenProfiles.length > 0) {
        setSelectedChildId(childrenProfiles[0].child_id);
    } 
  }, [childrenProfiles]); // Chạy khi danh sách trẻ em thay đổi

useEffect(() => {
    if (selectedChildId) {
        const selectedChild = childrenProfiles.find(child => child.child_id === selectedChildId);
        setChildData(selectedChild || null);
    }
}, [selectedChildId, childrenProfiles]);

  const filteredChildren = childrenProfiles.filter(child =>
      child.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.child_id.toString().includes(searchTerm)
  );

  if (!childData) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

  // In the same file
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    if (age === 0) {
        const monthAge = today.getMonth() - birth.getMonth() + 
            (today.getDate() < birth.getDate() ? -1 : 0) + 
            (today.getFullYear() - birth.getFullYear()) * 12;
        return `${monthAge} tháng`;
    }
    
    return `${age} tuổi`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
  };

  // In the same file
  const ProfileList = () => (
    <div className="profiles-sidebar">
        <div className="search-box">
            <FaSearch className="search-icon" />
            <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="profiles-list">
            {filteredChildren.map(child => (
                <div
                    key={child.child_id}
                    className={`profile-item ${child.child_id === selectedChildId ? 'active' : ''}`}
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
        </div>
    </div>
  );

  const DetailView = () => (
    <div className="profile-content">
      <div className="child-profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUserCircle size={80} color="#1976d2" />
          </div>
          <div className="profile-basic-info">
            <h1>{childData.full_name}</h1>
            <div className="profile-tags">
              <span className="profile-tag">ID: {childData.child_id}</span>
              <span className="profile-tag">{childData.gender}</span>
              <span className="profile-tag">{calculateAge(childData.date_of_birth)}</span>
              <span className="profile-tag">Nhóm máu: {childData.blood_type}</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Thông tin chi tiết
          </button>
          <button 
            className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            Lịch sử khám bệnh
          </button>
        </div>

        {activeTab === 'profile' ? (
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
                    <p className={`health-text ${childData.allergies === 'Không' ? 'normal' : 'warning'}`}>
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
          <div className="medical-records">
            {childMedicalRecords.length > 0 ? (
              childMedicalRecords.map((record) => (
                <div key={record.appointment_id} className="medical-record-card">
                  <div className="record-header">
                    <div className="record-date">
                      <h3>Lần khám ngày {formatDate(record.date)}</h3>
                      <span className="record-id">Mã khám: {record.appointment_id}</span>
                    </div>
                    <span className="staff-info">{record.staff_name}</span>
                  </div>
                  <div className="record-content">
                    <div className="record-field">
                      <h4>Triệu chứng:</h4>
                      <p>{record.symptoms}</p>
                    </div>
                    <div className="record-field">
                      <h4>Ghi chú:</h4>
                      <p>{record.notes}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-records">
                Chưa có lịch sử khám bệnh
              </div>
            )}
          </div>
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