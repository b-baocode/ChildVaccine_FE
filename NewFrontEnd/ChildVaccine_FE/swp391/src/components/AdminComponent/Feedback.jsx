import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, Users, MessageSquare } from 'lucide-react';
import feedbackService from '../../service/adminService';
import '../../styles/AdminStyles/AdminFeedback.css';

const Feedback = () => {
  // Fake data
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching feedbacks...');
        
        const data = await feedbackService.getAllFeedbacks();
        console.log('Received data:', data);
        
        const formattedFeedbacks = data.map(feedback => ({
          id: feedback.id, // Feedback ID
          appointmentId: feedback.appointment.appId, // Appointment ID
          customerName: feedback.customer.user.fullName,
          vaccineType: feedback.appointment.vaccineId 
            ? feedback.appointment.vaccineId.name 
            : feedback.appointment.packageId 
              ? feedback.appointment.packageId.name 
              : 'N/A',
          rating: feedback.rating,
          content: feedback.feedback,
          date: new Date(feedback.appointment.appointmentDate).toLocaleDateString('vi-VN')
        }));
  
        console.log('Formatted feedbacks:', formattedFeedbacks);
        setFeedbacks(formattedFeedbacks);
      } catch (err) {
        console.error('Feedback error details:', err);
        setError(err.message || 'Không thể tải dữ liệu phản hồi');
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeedbacks();
  }, []);

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
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesRating = selectedRating ? feedback.rating === parseInt(selectedRating) : true;
    const matchesSearch = searchTerm 
      ? feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    return matchesRating && matchesSearch;
  });

  return (
    <div className="feedback-dashboard">
      <h1 className="dashboard-title">Quản lý phản hồi</h1>
      
      {loading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card total-reviews">
              <div className="stat-icon">
                <MessageSquare size={24} />
              </div>
              <div className="stat-info">
                <h3>Tổng số đánh giá</h3>
                <div className="stat-value">{stats.total || 0}</div>
              </div>
            </div>
  
            <div className="stat-card average-rating">
              <div className="stat-icon">
                <Star size={24} />
              </div>
              <div className="stat-info">
                <h3>Đánh giá trung bình</h3>
                <div className="stat-value">
                  {stats.averageRating || 0}
                  <div className="stars-display">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.round(stats.averageRating) ? "#ffd700" : "none"}
                        color={i < Math.round(stats.averageRating) ? "#ffd700" : "#cbd5e1"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Rating Distribution */}
          <div className="rating-distribution-card">
            <h3>Phân bố đánh giá</h3>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="rating-bar-row">
                  <div className="rating-label">
                    {rating} <Star size={14} fill="#ffd700" color="#ffd700" />
                  </div>
                  <div className="bar-container">
                    <div 
                      className="bar"
                      style={{ 
                        width: `${(stats.ratingCounts[rating] || 0) / (stats.total || 1) * 100}%`,
                        backgroundColor: rating >= 4 ? '#22c55e' : rating === 3 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      <span className="bar-value">
                        {((stats.ratingCounts[rating] || 0) / (stats.total || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="count-label">{stats.ratingCounts[rating] || 0}</div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Filters */}
          <div className="filters-section">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên khách hàng..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={selectedRating} 
              onChange={(e) => setSelectedRating(e.target.value)}
              className="rating-filter"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
  
          {/* Feedback Table */}
          <div className="feedback-table-container">
            {filteredFeedbacks.length === 0 ? (
              <div className="no-data">Không tìm thấy phản hồi nào</div>
            ) : (
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mã đơn tiêm</th>
                    <th>Khách hàng</th>
                    <th>Loại vaccine</th>
                    <th>Đánh giá</th>
                    <th>Nội dung</th>
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
                        <div className="table-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < feedback.rating ? "#ffd700" : "none"}
                              color={i < feedback.rating ? "#ffd700" : "#cbd5e1"}
                            />
                          ))}
                        </div>
                      </td>
                      <td>{feedback.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Feedback;