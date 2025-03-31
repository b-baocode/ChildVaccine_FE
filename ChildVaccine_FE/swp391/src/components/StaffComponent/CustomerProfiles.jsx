import React, { useState } from 'react';

const CustomerProfiles = () => {
  const [customerProfiles, setCustomerProfiles] = useState([
    {
      id: 'CU001',
      name: 'Nguyễn Văn A',
      dob: '1990-01-01',
      gender: 'Nam',
      phone: '0912345678'
    },
    {
      id: 'CU002',
      name: 'Trần Thị B',
      dob: '1992-02-02',
      gender: 'Nữ',
      phone: '0987654321'
    },
    // Thêm các hồ sơ khách hàng khác ở đây
  ]);

  return (
    <div className="customer-profiles-page">
      <h1>Hồ sơ khách hàng</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Số điện thoại</th>
          </tr>
        </thead>
        <tbody>
          {customerProfiles.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.id}</td>
              <td>{profile.name}</td>
              <td>{profile.dob}</td>
              <td>{profile.gender}</td>
              <td>{profile.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerProfiles;