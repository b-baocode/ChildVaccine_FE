import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import '../../styles/CusStyles/Feedback.css';

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data for vaccination details
  const vaccinationDetails = {
    date: "2024-03-15",
    time: "09:30",
    childName: "Nguyễn Minh Anh",
    vaccine: "MMR",
    doctor: "BS. Nguyễn Văn A",
    location: "VNVC Quận 1"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log({ rating, message });
    setShowSuccess(true);
    
    // Redirect to home after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-container">
        <h2>Đánh giá buổi tiêm chủng</h2>
        
        <div className="vaccination-details">
          <p><strong>Ngày tiêm:</strong> {vaccinationDetails.date}</p>
          <p><strong>Thời gian:</strong> {vaccinationDetails.time}</p>
          <p><strong>Trẻ:</strong> {vaccinationDetails.childName}</p>
          <p><strong>Vaccine:</strong> {vaccinationDetails.vaccine}</p>
          <p><strong>Bác sĩ:</strong> {vaccinationDetails.doctor}</p>
          <p><strong>Địa điểm:</strong> {vaccinationDetails.location}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            <p>Mức độ hài lòng của bạn:</p>
            <div className="stars">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      size={30}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="feedback-message">
            <label htmlFor="message">Nhận xét của bạn:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              rows="4"
            />
          </div>

          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              Hủy bỏ
            </button>
            <button type="submit" className="submit-btn" disabled={!rating}>
              Gửi đánh giá
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="success-popup">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h3>Cảm ơn bạn đã đánh giá!</h3>
              <p>Phản hồi của bạn đã được ghi nhận.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;