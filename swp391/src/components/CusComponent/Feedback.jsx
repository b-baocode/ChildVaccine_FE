import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import feedbackService from '../../service/feedbackService';
import appointmentService from '../../service/appointmentService'; // Add this import
import '../../styles/CusStyles/Feedback.css';

const Feedback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [appointmentInfo, setAppointmentInfo] = useState(null);;

  useEffect(() => {
    const loadAppointmentInfo = async () => {
        const pendingFeedback = await appointmentService.getPendingFeedbackAppointment();
        if (!pendingFeedback) {
            navigate('/');
            return;
        }
        setAppointmentInfo(pendingFeedback.appointmentInfo);
    };

    loadAppointmentInfo();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const feedbackData = {
            appointmentId: appointmentInfo.appId,
            customerId: appointmentInfo.customerId,
            rating: parseInt(rating),
            feedback: feedback
        };

        await feedbackService.submitFeedback(feedbackData);
        appointmentService.clearPendingFeedback();
        navigate('/');
    } catch (error) {
        console.error('Error submitting feedback:', error);
    }
};

  if (loading) {
      return <div>Loading...</div>;
  }

  if (!pendingFeedback) {
      return <div>No pending feedback required.</div>;
  }

  return (
    <div className="feedback-container">
        <h2>Đánh giá dịch vụ</h2>
        <form onSubmit={handleSubmit}>
            <div className="rating-container">
                <label>Đánh giá của bạn:</label>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'active' : ''}`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            <div className="feedback-input">
                <label>Nhận xét:</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                />
            </div>

            <button type="submit" className="submit-btn">
                Gửi đánh giá
            </button>
        </form>
    </div>
  );
};

export default Feedback;