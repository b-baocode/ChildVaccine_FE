import React, { useState } from 'react';

const PostVaccinationInfo = () => {
  const [reactions, setReactions] = useState([
    {
      id: 'RE001',
      customerName: 'Nguyễn Văn A',
      vaccine: 'Covid-19',
      reaction: 'Sốt nhẹ',
      severity: 'Nhẹ',
      date: '2024-03-15'
    },
    {
      id: 'RE002',
      customerName: 'Trần Thị B',
      vaccine: 'Viêm gan B',
      reaction: 'Đau đầu',
      severity: 'Trung bình',
      date: '2024-03-16'
    },
    // Thêm các phản ứng sau tiêm khác ở đây
  ]);

  return (
    <div className="post-vaccination-info-page">
      <h1>Thông tin phản ứng sau tiêm</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Vaccine</th>
            <th>Phản ứng</th>
            <th>Mức độ</th>
            <th>Ngày</th>
          </tr>
        </thead>
        <tbody>
          {reactions.map((reaction) => (
            <tr key={reaction.id}>
              <td>{reaction.id}</td>
              <td>{reaction.customerName}</td>
              <td>{reaction.vaccine}</td>
              <td>{reaction.reaction}</td>
              <td>{reaction.severity}</td>
              <td>{reaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostVaccinationInfo;