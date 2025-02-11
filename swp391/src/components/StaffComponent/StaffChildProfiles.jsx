import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaNotesMedical, FaRuler, FaWeight, FaSearch } from 'react-icons/fa';
import '../../styles/StaffStyles/StaffChildProfiles.css';

const StaffChildProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [childData, setChildData] = useState(null);
  const [childMedicalRecords, setChildMedicalRecords] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(id || 1);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data trực tiếp trong component
  const childrenProfiles = [
    {
      child_id: 1,
      cus_id: 101,
      full_name: "Nguyễn Minh Anh",
      date_of_birth: "2020-03-15",
      gender: "Nữ",
      height: 98.5,
      weight: 15.8,
      blood_type: "O+",
      allergies: "Dị ứng với đậu phộng",
      health_note: "Tiền sử viêm phế quản"
    },
    {
      child_id: 2,
      cus_id: 102,
      full_name: "Trần Đức Minh",
      date_of_birth: "2021-07-22",
      gender: "Nam",
      height: 85.2,
      weight: 12.5,
      blood_type: "A+",
      allergies: "Không",
      health_note: "Khỏe mạnh"
    },
    {
      child_id: 3,
      cus_id: 103,
      full_name: "Lê Thu Hà",
      date_of_birth: "2022-01-10",
      gender: "Nữ",
      height: 78.5,
      weight: 10.2,
      blood_type: "B+",
      allergies: "Dị ứng với sữa bò",
      health_note: "Đang theo dõi chậm tăng cân"
    },
    {
      child_id: 4,
      cus_id: 104,
      full_name: "Phạm Tuấn Kiệt",
      date_of_birth: "2019-11-30",
      gender: "Nam",
      height: 105.0,
      weight: 17.3,
      blood_type: "AB+",
      allergies: "Không",
      health_note: "Tiền sử co giật do sốt cao"
    },
    {
      child_id: 5,
      cus_id: 105,
      full_name: "Hoàng Mai Anh",
      date_of_birth: "2021-09-05",
      gender: "Nữ",
      height: 82.3,
      weight: 11.8,
      blood_type: "O-",
      allergies: "Dị ứng với hải sản",
      health_note: "Khỏe mạnh"
    }
  ];

  const medicalRecordsData = [
    {
      child_id: 1,
      records: [
        {
          appointment_id: 101,
          staff_id: 201,
          staff_name: "BS. Nguyễn Văn A",
          date: "2024-03-10",
          symptoms: "Sốt nhẹ 37.8°C, ho khan",
          notes: "Tiêm vaccine MMR mũi 2, theo dõi 30 phút sau tiêm. Kê đơn thuốc hạ sốt."
        },
        {
          appointment_id: 102,
          staff_id: 202,
          staff_name: "BS. Trần Thị B",
          date: "2024-01-15",
          symptoms: "Khám định kỳ, không có triệu chứng bất thường",
          notes: "Phát triển bình thường theo độ tuổi. Tư vấn chế độ dinh dưỡng."
        }
      ]
    },
    {
      child_id: 2,
      records: [
        {
          appointment_id: 201,
          staff_id: 203,
          staff_name: "BS. Lê Văn C",
          date: "2024-03-05",
          symptoms: "Ho có đờm, sốt 38.5°C",
          notes: "Viêm đường hô hấp trên. Kê đơn kháng sinh và thuốc ho."
        }
      ]
    },
    {
      child_id: 3,
      records: [
        {
          appointment_id: 301,
          staff_id: 204,
          staff_name: "BS. Hoàng Thị D",
          date: "2024-02-20",
          symptoms: "Biếng ăn, chậm tăng cân",
          notes: "Tư vấn chế độ dinh dưỡng đặc biệt. Hẹn tái khám sau 2 tuần."
        }
      ]
    },
    {
      child_id: 4,
      records: [
        {
          appointment_id: 401,
          staff_id: 205,
          staff_name: "BS. Phan Văn E",
          date: "2024-03-01",
          symptoms: "Sốt cao 39.5°C, co giật",
          notes: "Nhập viện theo dõi. Kê đơn thuốc hạ sốt và chống co giật."
        },
        {
          appointment_id: 402,
          staff_id: 205,
          staff_name: "BS. Phan Văn E",
          date: "2024-03-08",
          symptoms: "Khám lại sau điều trị",
          notes: "Tình trạng ổn định. Tiếp tục theo dõi và dùng thuốc theo đơn."
        }
      ]
    },
    {
      child_id: 5,
      records: [
        {
          appointment_id: 501,
          staff_id: 206,
          staff_name: "BS. Mai Thị F",
          date: "2024-01-25",
          symptoms: "Khám định kỳ 6 tháng",
          notes: "Phát triển tốt. Tiêm vaccine theo lịch."
        },
        {
          appointment_id: 502,
          staff_id: 207,
          staff_name: "BS. Trương Văn G",
          date: "2024-03-12",
          symptoms: "Phát ban, ngứa sau ăn tôm",
          notes: "Dị ứng hải sản. Kê đơn thuốc kháng dị ứng và hướng dẫn phòng tránh."
        }
      ]
    }
  ];

  const filteredChildren = childrenProfiles.filter(child =>
    child.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.child_id.toString().includes(searchTerm)
  );


  useEffect(() => {
    const targetId = parseInt(selectedChildId);
    const child = childrenProfiles.find(child => child.child_id === targetId);
    setChildData(child || childrenProfiles[0]);

    const records = medicalRecordsData.find(record => record.child_id === targetId);
    setChildMedicalRecords(records ? records.records : []);
  }, [selectedChildId]);

  if (!childData) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const ProfileList = () => (
    <div className="profiles-sidebar">
      <div className="profiles-list">
        {filteredChildren.map(child => (
          <div
            key={child.child_id}
            className={`profile-item ${child.child_id === parseInt(selectedChildId) ? 'active' : ''}`}
            onClick={() => setSelectedChildId(child.child_id)}
          >
            <FaUserCircle className="profile-icon" />
            <div className="profile-brief">
              <h3>{child.full_name}</h3>
              <p>ID: {child.child_id} • {calculateAge(child.date_of_birth)}</p>
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