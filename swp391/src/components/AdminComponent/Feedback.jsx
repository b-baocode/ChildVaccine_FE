import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import '../../styles/AdminFeedback.css';

const Feedback = () => {
  // Fake data
  const [feedbacks] = useState([
    {
      id: "FB001",
      appointmentId: "APT112233",
      customerName: "Nguyễn Văn An",
      content: "Dịch vụ rất tốt, nhân viên thân thiện và chuyên nghiệp",
      rating: 5,
      date: "2024-03-15",
      vaccineType: "Vaccine 6 trong 1"
    },
    {
      id: "FB002",
      appointmentId: "APT112234",
      customerName: "Trần Thị Bình",
      content: "Con tôi không khóc khi tiêm, bác sĩ rất giỏi",
      rating: 5,
      date: "2024-03-14",
      vaccineType: "Vaccine Viêm gan B"
    },
    {
      id: "FB003",
      appointmentId: "APT112235",
      customerName: "Lê Minh Cường",
      content: "Thời gian chờ đợi hơi lâu nhưng chất lượng dịch vụ tốt",
      rating: 4,
      date: "2024-03-14",
      vaccineType: "Vaccine Rotavirus"
    },
    {
      id: "FB004",
      appointmentId: "APT112236",
      customerName: "Phạm Thị Dung",
      content: "Giá hơi cao nhưng xứng đáng với chất lượng",
      rating: 4,
      date: "2024-03-13",
      vaccineType: "Vaccine 5 trong 1"
    },
    {
      id: "FB005",
      appointmentId: "APT112237",
      customerName: "Hoàng Văn Em",
      content: "Cơ sở vật chất sạch sẽ, hiện đại",
      rating: 5,
      date: "2024-03-13",
      vaccineType: "Vaccine Pneumo"
    },
    {
      id: "FB006",
      appointmentId: "APT112238",
      customerName: "Đỗ Thị Phương",
      content: "Hơi khó tìm địa điểm, nhưng nhân viên nhiệt tình hướng dẫn",
      rating: 3,
      date: "2024-03-12",
      vaccineType: "Vaccine 6 trong 1"
    },
    {
      id: "FB007",
      appointmentId: "APT112239",
      customerName: "Vũ Đình Giang",
      content: "Tốt, sẽ quay lại lần sau",
      rating: 4,
      date: "2024-03-12",
      vaccineType: "Vaccine Viêm gan B"
    },
    {
      id: "FB008",
      appointmentId: "APT112240",
      customerName: "Ngô Thị Hương",
      content: "Dịch vụ tạm được, cần cải thiện thêm về thời gian chờ",
      rating: 3,
      date: "2024-03-11",
      vaccineType: "Vaccine Rotavirus"
    },
    {
      id: "FB009",
      appointmentId: "APT112241",
      customerName: "Đặng Văn Inh",
      content: "Rất hài lòng với dịch vụ",
      rating: 5,
      date: "2024-03-11",
      vaccineType: "Vaccine 5 trong 1"
    },
    {
      id: "FB010",
      appointmentId: "APT112242",
      customerName: "Bùi Thị Kim",
      content: "Không gian thoáng mát, sạch sẽ",
      rating: 4,
      date: "2024-03-10",
      vaccineType: "Vaccine Pneumo"
    }
  ]);

  const [selectedRating, setSelectedRating] = useState('');

  // Tính toán thống kê
  const calculateStats = () => {
    const total = feedbacks.length;
    const averageRating = (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1);
    const ratingCounts = feedbacks.reduce((acc, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      averageRating,
      ratingCounts
    };
  };

  const stats = calculateStats();

  // Lọc feedback theo rating
  const filteredFeedbacks = selectedRating
    ? feedbacks.filter(feedback => feedback.rating === parseInt(selectedRating))
    : feedbacks;

  return (
    <div className="feedback-container">
      {/* Phần thống kê */}
      <div className="feedback-stats">
        <div className="stat-card">
          <h3>Tổng số đánh giá</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Đánh giá trung bình</h3>
          <div className="stat-value">
            {stats.averageRating} <Star size={20} fill="#ffd700" color="#ffd700" />
          </div>
        </div>
        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="rating-bar">
              <span>{rating} sao</span>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{ 
                    width: `${(stats.ratingCounts[rating] || 0) / stats.total * 100}%` 
                  }}
                ></div>
              </div>
              <span>{stats.ratingCounts[rating] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phần tìm kiếm */}
      <div className="feedback-filters">
        <div className="search-field">
          <Search size={20} />
          <select 
            value={selectedRating} 
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>

      {/* Danh sách feedback */}
      <div className="feedback-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã đơn tiêm</th>
              <th>Khách hàng</th>
              <th>Loại vaccine</th>
              <th>Đánh giá</th>
              <th>Nội dung</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.appointmentId}</td>
                <td>{feedback.customerName}</td>
                <td>{feedback.vaccineType}</td>
                <td>
                  <div className="rating-display">
                    {Array(feedback.rating).fill().map((_, i) => (
                      <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                    ))}
                  </div>
                </td>
                <td>{feedback.content}</td>
                <td>{feedback.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Feedback;