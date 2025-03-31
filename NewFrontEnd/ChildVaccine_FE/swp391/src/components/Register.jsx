import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../service/AuthenService';
import '../styles/Register.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        address: '',
        gender: '',
        dateOfBirth: '',
    });
    const [error, setError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

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

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Validate terms acceptance
        if (!termsAccepted) {
            setError('Vui lòng đồng ý với điều khoản và điều kiện!');
            return;
        }

        try {
            // Prepare data for API
            const registerData = {
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender.toUpperCase()
            };

            const response = await authService.register(registerData);
            console.log('📡 Registration Response:', response);
            // Show success modal
            const modal = document.createElement('div');
            modal.className = 'success-modal';
            modal.innerHTML = `
                <div class="success-content">
                    <h3>Đăng ký thành công!</h3>
                    <p>Vui lòng đăng nhập để tiếp tục.</p>
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
            console.error('Registration error:', err);
            setError(err.message || 'Email đã tồn tại trong hệ thống');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <h2>Đăng Ký Tài Khoản</h2>
                    <p>Vui lòng điền đầy đủ thông tin để tạo tài khoản</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Địa chỉ email"
                            required
                        />
                    </div>           

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Họ và tên"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            pattern="[0-9]{10}"
                            title="Vui lòng nhập số điện thoại hợp lệ (10 số)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Địa chỉ"
                            required
                        />
                    </div>

                    <div className="form-group gender-group">
                        <span className="gender-label">Giới tính:</span>
                        <div className="gender-options">
                            <label>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleChange}
                                    required 
                                />
                                Nam
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleChange}
                                    required 
                                />
                                Nữ
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group terms">
                        <label className="checkbox-label">
                            <input 
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                required 
                            />
                            <span>Tôi đồng ý với các điều khoản và điều kiện</span>
                        </label>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="submit-btn">
                        Đăng Ký
                    </button>

                    <div className="register-footer">
                        <p>
                            Bạn đã có tài khoản?{' '}
                            <button
                                type="button"
                                className="toggle-btn"
                                onClick={handleLoginClick}
                            >
                                Đăng Nhập
                            </button>
                        </p>
                    </div>
                </form>
            </div>

            <div className="register-image">
                <div className="overlay"></div>
                <div className="image-content">
                    <h1>Chào mừng đến với VNVC</h1>
                    <p>Đối tác tiêm chủng đáng tin cậy của bạn</p>
                </div>
            </div>
        </div>
    );
};

export default Register; 