import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();

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

                <form className="register-form">                 
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Địa chỉ email"
                            required
                        />
                    </div>            

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Họ và tên"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Số điện thoại"
                            pattern="[0-9]{10}"
                            title="Vui lòng nhập số điện thoại hợp lệ (10 số)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            name="address"
                            placeholder="Địa chỉ"
                            required
                            rows="3"
                        ></input>
                    </div>

                    <div className="form-group gender-group">
                        <span className="gender-label">Giới tính:</span>
                        <div className="gender-options">
                            <label>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    value="male" 
                                    required 
                                />
                                Nam
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    value="female" 
                                    required 
                                />
                                Nữ
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="date"
                            name="birthDate"
                            placeholder="Ngày sinh"
                            required
                        />
                    </div>
                                    

                    <div className="form-group terms">
                        <label className="checkbox-label">
                            <input type="checkbox" required />
                            <span>Tôi đồng ý với các điều khoản và điều kiện</span>
                        </label>
                    </div>

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