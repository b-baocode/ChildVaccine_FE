import React, { useState } from 'react';
import { Phone, LogOut, Calendar, UserCircle, AlertCircle } from 'lucide-react';
import '../styles/ChildProfiles.css';

function ChildProfiles() {
  const [childProfiles, setChildProfiles] = useState([
    { id: 'CH001', name: 'Nguyễn Văn B', dob: '2015-05-01', gender: 'Nam', parentName: 'Nguyễn Văn A', vaccine: 'Covid-19', date: '2024-03-15' },
    { id: 'CH002', name: 'Trần Thị C', dob: '2016-06-02', gender: 'Nữ', parentName: 'Trần Thị B', vaccine: 'Viêm gan B', date: '2024-03-16' },
    { id: 'CH003', name: 'Lê Văn D', dob: '2017-07-03', gender: 'Nam', parentName: 'Lê Văn C', vaccine: 'Cúm mùa', date: '2024-03-17' },
    { id: 'CH004', name: 'Phạm Thị E', dob: '2018-08-04', gender: 'Nữ', parentName: 'Phạm Thị D', vaccine: 'HPV', date: '2024-03-18' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    id: '',
    name: '',
    dob: '',
    gender: '',
    parentName: '',
    vaccine: '',
    date: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChildProfiles([...childProfiles, newProfile]);
    setShowForm(false);
    setNewProfile({
      id: '',
      name: '',
      dob: '',
      gender: '',
      parentName: '',
      vaccine: '',
      date: ''
    });
  };

  return (
    <div className="home">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-content">
          <span>Trung tâm tiêm chủng Long Châu</span>
          <div className="banner-actions">
            <a href="tel:18006928" className="banner-action">
              <Phone size={16} />
              <span>1800 6928</span>
            </a>
            <a href="#" className="banner-action">
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <nav className="menu">
            <a href="#" className="menu-item">
              <Calendar size={20} />
              <span>Thông tin lịch hẹn</span>
            </a>
            <a href="#" className="menu-item">
              <AlertCircle size={20} />
              <span>Thông tin phản ứng sau tiêm</span>
            </a>
            <a href="#" className="menu-item">
              <UserCircle size={20} />
              <span>Hồ sơ khách hàng</span>
            </a>
          </nav>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          <h1>Danh sách hồ sơ trẻ em</h1>
          <button onClick={() => setShowForm(true)}>Tạo thêm hồ sơ</button>
          {showForm && (
            <form onSubmit={handleSubmit} className="child-profile-form">
              <input type="text" name="id" placeholder="ID" value={newProfile.id} onChange={handleInputChange} required />
              <input type="text" name="name" placeholder="Tên" value={newProfile.name} onChange={handleInputChange} required />
              <input type="date" name="dob" placeholder="Ngày sinh" value={newProfile.dob} onChange={handleInputChange} required />
              <input type="text" name="gender" placeholder="Giới tính" value={newProfile.gender} onChange={handleInputChange} required />
              <input type="text" name="parentName" placeholder="Tên phụ huynh" value={newProfile.parentName} onChange={handleInputChange} required />
              <input type="text" name="vaccine" placeholder="Vaccine" value={newProfile.vaccine} onChange={handleInputChange} required />
              <input type="date" name="date" placeholder="Ngày tiêm" value={newProfile.date} onChange={handleInputChange} required />
              <button type="submit">Lưu</button>
            </form>
          )}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Tên phụ huynh</th>
                  <th>Vaccine</th>
                  <th>Ngày tiêm</th>
                </tr>
              </thead>
              <tbody>
                {childProfiles.map((profile) => (
                  <tr key={profile.id}>
                    <td>{profile.id}</td>
                    <td>{profile.name}</td>
                    <td>{profile.dob}</td>
                    <td>{profile.gender}</td>
                    <td>{profile.parentName}</td>
                    <td>{profile.vaccine}</td>
                    <td>{profile.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildProfiles;