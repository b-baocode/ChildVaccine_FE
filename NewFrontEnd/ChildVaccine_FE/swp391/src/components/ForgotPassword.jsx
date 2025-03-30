import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaLock } from 'react-icons/fa';
import authService from '../service/AuthenService';
import '../styles/Login.css';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); // 1: Email input, 2: Code verification, 3: New password
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');



    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.requestOtp(email);
            setMessage('Mã xác thực đã được gửi đến email của bạn');
            setError('');
            setStep(2);
        } catch (err) {
            setError(err.message || 'Không thể gửi mã xác thực. Vui lòng thử lại');
            console.error('Error requesting OTP:', err);
        }
    };

    const handleCodeVerification = async (e) => {
        e.preventDefault();
        try {
            await authService.verifyOtp(email, verificationCode);
            setError('');
            setStep(3);
        } catch (err) {
            setError(err.message || 'Mã xác thực không hợp lệ');
            console.error('Error verifying OTP:', err);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            await authService.resetPassword(email, verificationCode, newPassword);
            
            const modal = document.createElement('div');
            modal.className = 'success-modal';
            modal.innerHTML = `
                <div class="success-content">
                    <h3>Đổi mật khẩu thành công</h3>
                    <p>Vui lòng đăng nhập lại với mật khẩu mới</p>
                </div>
            `;
            document.body.appendChild(modal);

            setTimeout(() => {
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modal);
                    navigate('/login');
                }, 300);
            }, 1700);
        } catch (err) {
            setError(err.message || 'Không thể đổi mật khẩu. Vui lòng thử lại');
            console.error('Error resetting password:', err);
        }
    };

    const handleResendOtp = async () => {
        try {
            await authService.requestOtp(email);
            setMessage('Đã gửi lại mã xác thực');
            setError('');
        } catch (err) {
            setError(err.message || 'Không thể gửi lại mã. Vui lòng thử lại');
            console.error('Error resending OTP:', err);
        }
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <button
                        className="back-btn"
                        onClick={() => navigate('/login')}
                        style={{ position: 'absolute', left: '20px', top: '20px' }}
                    >
                        <FaArrowLeft /> Quay lại
                    </button>
                    <h2>Khôi Phục Mật Khẩu</h2>
                    <p>{step === 1 ?
                        'Nhập email của bạn để nhận mã xác thực' :
                        step === 2 ?
                        'Nhập mã xác thực đã được gửi đến email của bạn' :
                        'Tạo mật khẩu mới'
                    }</p>
                </div>


                {step === 1 ? (
                    <form className="login-form" onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <div className="input-with-icon">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập địa chỉ email"
                                    required
                                />
                            </div>
                        </div>


                        <button type="submit" className="submit-btn">
                            Gửi Mã Xác Thực
                        </button>
                    </form>
                ) : step === 2 ? (
                    <form className="login-form" onSubmit={handleCodeVerification}>
                        <div className="form-group">
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Nhập mã xác thực"
                                required
                            />
                        </div>


                        {message && <div className="success-message">{message}</div>}
                        {error && <div className="error-message">{error}</div>}


                        <button type="submit" className="submit-btn">
                            Xác Nhận
                        </button>


                        <button
                            type="button"
                            className="resend-btn"
                            onClick={handleResendOtp}
                        >
                            Gửi lại mã
                        </button>
                    </form>
                ) : (
                    <form className="login-form" onSubmit={handlePasswordReset}>
                        <div className="form-group">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                required
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}


                        <button type="submit" className="submit-btn">
                            Đổi Mật Khẩu
                        </button>
                    </form>
                )}
            </div>


            <div className="login-image">
                <div className="overlay"></div>
                <div className="image-content">
                    <h1>Khôi Phục Mật Khẩu</h1>
                    <p>Chúng tôi sẽ giúp bạn lấy lại mật khẩu</p>
                </div>
            </div>
        </div>
    );
};


export default ForgotPassword;

