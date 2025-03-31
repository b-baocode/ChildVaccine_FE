import React from 'react';
import '../styles/LogoutConfirmDialog.css';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutConfirmDialog = ({ onConfirm, onCancel }) => {
    return (
        <div className="logout-dialog-overlay">
            <div className="logout-dialog">
                <div className="logout-dialog-icon">
                    <FaSignOutAlt />
                </div>
                <h2>Xác nhận đăng xuất</h2>
                <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
                <div className="logout-dialog-buttons">
                    <button className="cancel-button" onClick={onCancel}>
                        Hủy bỏ
                    </button>
                    <button className="confirm-button" onClick={onConfirm}>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmDialog; 