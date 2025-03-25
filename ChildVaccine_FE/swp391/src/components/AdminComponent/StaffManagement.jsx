import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../styles/AdminStyles/StaffManagement.css';

const StaffManagement = () => {
    const [staffList, setStaffList] = useState([
        {
          id: '#C012837',
          name: 'Hồ Thị Thanh Nghi',
          avatar: '/avatars/staff1.jpg',
          address: '185/137 Trần Quốc Thảo, Quận 3, Hồ Chí Minh',
          birthDate: '02/02/1998',
          gender: 'Nữ',
          phone: '0929727168',
          position: 'Bán hàng'
        },
        {
          id: '#C012838',
          name: 'Nguyễn Văn An',
          avatar: '/avatars/staff2.jpg',
          address: '23 Lê Văn Việt, Quận 9, Hồ Chí Minh',
          birthDate: '15/08/1995',
          gender: 'Nam',
          phone: '0901234567',
          position: 'Quản lý'
        },
        {
          id: '#C012839',
          name: 'Trần Thị Bích Hằng',
          avatar: '/avatars/staff3.jpg',
          address: '45 Nguyễn Thị Minh Khai, Quận 1, Hồ Chí Minh',
          birthDate: '20/04/1997',
          gender: 'Nữ',
          phone: '0918765432',
          position: 'Kế toán'
        },
        {
          id: '#C012840',
          name: 'Lê Minh Tuấn',
          avatar: '/avatars/staff4.jpg',
          address: '78 Võ Văn Tần, Quận 3, Hồ Chí Minh',
          birthDate: '10/12/1994',
          gender: 'Nam',
          phone: '0965432109',
          position: 'Nhân viên IT'
        },
        {
          id: '#C012841',
          name: 'Phạm Thu Thảo',
          avatar: '/avatars/staff5.jpg',
          address: '156 Phan Xích Long, Phú Nhuận, Hồ Chí Minh',
          birthDate: '25/06/1996',
          gender: 'Nữ',
          phone: '0938765421',
          position: 'Nhân viên Marketing'
        },
        {
          id: '#C012842',
          name: 'Đặng Quốc Huy',
          avatar: '/avatars/staff6.jpg',
          address: '234 Nguyễn Văn Cừ, Quận 5, Hồ Chí Minh',
          birthDate: '08/03/1993',
          gender: 'Nam',
          phone: '0977123456',
          position: 'Bán hàng'
        },
        {
          id: '#C012843',
          name: 'Vũ Thị Mai Anh',
          avatar: '/avatars/staff7.jpg',
          address: '89 Điện Biên Phủ, Bình Thạnh, Hồ Chí Minh',
          birthDate: '12/09/1999',
          gender: 'Nữ',
          phone: '0909876543',
          position: 'Nhân viên Marketing'
        },
        {
          id: '#C012844',
          name: 'Trương Đình Long',
          avatar: '/avatars/staff8.jpg',
          address: '67 Huỳnh Thúc Kháng, Quận 1, Hồ Chí Minh',
          birthDate: '30/11/1992',
          gender: 'Nam',
          phone: '0912345678',
          position: 'Quản lý'
        }
      ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [searchGender, setSearchGender] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePositionChange = (e) => {
    setSearchPosition(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSearchGender(e.target.value);
  };

  const filteredStaffList = staffList.filter(staff =>
    staff.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
    staff.position.toLowerCase().includes(searchPosition.toLowerCase()) &&
    staff.gender.toLowerCase().includes(searchGender.toLowerCase())
  );

  const handleUpdate = (id) => {
    // Logic for updating the profile
  };

  const handleDelete = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
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
      <div className="staff-list">
        {filteredStaffList.map((staff) => (
          <div key={staff.id} className="staff-card">
            <div className="staff-details">
              <h2>{staff.name}</h2>
              <p>ID: {staff.id}</p>
              <p>Ngày sinh: {staff.birthDate}</p>
              <p>Địa chỉ: {staff.address}</p>
              <p>Số điện thoại: {staff.phone}</p>
              <p>Chức vụ: {staff.position}</p>
              <p>Giới tính: {staff.gender}</p>
              <button onClick={() => handleUpdate(staff.id)}>Cập nhật</button>
              <button onClick={() => handleDelete(staff.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffManagement;