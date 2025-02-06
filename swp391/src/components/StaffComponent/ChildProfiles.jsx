import React, { useState } from 'react';

const ChildProfiles = () => {
  const [childProfiles, setChildProfiles] = useState([
    {
      id: 'CH001',
      name: 'Nguyễn Văn B',
      dob: '2015-05-01',
      gender: 'Nam',
      parentName: 'Nguyễn Văn A',
      vaccine: 'Covid-19',
      date: '2024-03-15'
    },
    // Thêm các hồ sơ trẻ em khác ở đây
  ]);

  return (
    <div className="child-profiles-page">
      <h1>Danh sách hồ sơ trẻ em</h1>
      <div className="child-profiles-list">
        {childProfiles.map((profile) => (
          <div key={profile.id} className="child-profile-card">
            <div className="child-profile-details">
              <h2>{profile.name}</h2>
              <p>ID: {profile.id}</p>
              <p>Ngày sinh: {profile.dob}</p>
              <p>Giới tính: {profile.gender}</p>
              <p>Phụ huynh: {profile.parentName}</p>
              <p>Vaccine: {profile.vaccine}</p>
              <p>Ngày tiêm: {profile.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChildProfiles;