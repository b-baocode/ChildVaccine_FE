import React, { useState } from 'react';
import '../styles/PaymentReview.css';

const PaymentReview = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Rating:', rating);
    console.log('Comment:', comment);
  };

  return (
    <div className="payment-review-page">
      <h1>Payment and Review</h1>
      <div className="payment-section">
        <h2>Scan to Pay</h2>
        <img src="https://via.placeholder.com/256" alt="QR Code" />
      </div>
      <div className="review-section">
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? 'selected' : ''}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Leave your comment here"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentReview;