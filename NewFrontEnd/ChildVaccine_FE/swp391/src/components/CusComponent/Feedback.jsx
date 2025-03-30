import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import feedbackService from '../../service/feedbackService';
import '../../styles/CusStyles/Feedback.css';

const Feedback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appointmentData = location.state?.appointment;

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThanks, setShowThanks] = useState(false);

    useEffect(() => {
        if (!appointmentData) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000); // Chuyển hướng sau 2 giây
            return () => clearTimeout(timer); // Cleanup để tránh memory leak
        }
    }, [appointmentData, navigate]);

    if (!appointmentData) {
        return <div>Không có lịch hẹn nào cần đánh giá.</div>;
    }

    const { appId, cusId, cusName, childName, appointmentDate, vaccineOrPackage } = appointmentData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (rating === 0) {
                setError('Vui lòng chọn số sao đánh giá');
                setIsSubmitting(false);
                return;
            }

            const feedbackData = {
                appointmentId: appId,
                rating: parseInt(rating),
                feedback: feedback
            };

            const response = await feedbackService.submitFeedback(feedbackData);
            if (response.feedbackId) { // Check for feedbackId in FeedbackDTO
                setShowThanks(true);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                throw new Error(response.message || 'Đã có lỗi xảy ra khi gửi đánh giá');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError(error.message || 'Đã có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback-container">
            <h2>Đánh giá dịch vụ</h2>
            <div className="appointment-info">
                <p><strong>Mã lịch hẹn:</strong> {appId}</p>
                <p><strong>Khách hàng:</strong> {cusName}</p>
                <p><strong>Trẻ em:</strong> {childName}</p>
                <p><strong>Ngày hẹn:</strong> {appointmentDate}</p>
                <p><strong>Dịch vụ:</strong> {vaccineOrPackage}</p>
            </div>

            {error && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
            {showThanks && (
                <div className="success-message" style={{ color: 'green', margin: '10px 0' }}>
                    Cảm ơn bạn đã đánh giá dịch vụ!
                </div>
            )}

            {!showThanks && (
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
                            disabled={isSubmitting}
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Feedback;