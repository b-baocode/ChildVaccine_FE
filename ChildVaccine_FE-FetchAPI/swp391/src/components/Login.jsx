import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import authService from '../service/AuthenService';
import appointmentService from '../service/appointmentService';
import sessionService from '../service/sessionService'; // Add this import

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await authService.login(formData);
            console.log('Login response:', response);
    
            if (!response || !response.body || !response.body.user) {
                setError("Lỗi đăng nhập. Vui lòng thử lại.");
                return;
            }
    
            // 🔥 Gọi login từ AuthContext để cập nhật user
            await login(response);
    
            // 🔥 Kiểm tra lại localStorage
            console.log("Final check - Token in localStorage:", localStorage.getItem("authToken"));
    
            // Điều hướng trang chính
            const { role } = response.body.user;
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'STAFF') navigate('/staff');
            else navigate('/', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError('Email hoặc mật khẩu không chính xác!');
        }
    };
    
    
    
    const showSuccessModal = (user) => {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-content">
                <h3>Đăng nhập thành công</h3>
                <p>Xin chào, ${user.fullName}</p>
            </div>
        `;
        document.body.appendChild(modal);
    
        setTimeout(() => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                if (user.role === 'ADMIN') navigate('/admin');
                else if (user.role === 'STAFF') navigate('/staff');
                else navigate('/', { replace: true });
            }, 300);
        }, 1700);
    };

    const toggleForm = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>Chào Mừng Trở Lại</h2>
                    <p>Vui lòng đăng nhập vào tài khoản của bạn</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Địa chỉ email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="/forgot-password" className="forgot-password">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" className="submit-btn">
                        Đăng Nhập
                    </button>

                    <div className="login-footer">
                        <p>
                            Bạn chưa có tài khoản?{' '}
                            <button 
                                type="button"
                                className="toggle-btn" 
                                onClick={toggleForm}
                            >
                                Đăng Ký
                            </button>
                        </p>
                    </div>
                </form>
            </div>

            <div className="login-image">
                <div className="overlay"></div>
                <div className="image-content">
                    <h1>Chào mừng đến với VNVC</h1>
                    <p>Đối tác tiêm chủng đáng tin cậy của bạn</p>
                </div>
            </div>
        </div>
    );
};

export default Login; 