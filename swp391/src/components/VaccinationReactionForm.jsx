import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import childService from '../service/childService';
import appointmentService from '../service/appointmentService';
import reactionService from '../service/reactionService';
import sessionService from '../service/sessionService';
import '../styles/VaccinationReactionForm.css';

const VaccinationReactionForm = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [children, setChildren] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submittedReaction, setSubmittedReaction] = useState(null);

  // Fetch children when component mounts
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const sessionData = await sessionService.checkSession();
        if (!sessionData || !sessionData.cusId) {
          throw new Error('No valid session found');
        }

        const childrenData = await childService.getCustomerChildren(sessionData.cusId);
        setChildren(childrenData);
      } catch (err) {
        console.error('Error fetching children:', err);
        setError('Không thể tải danh sách trẻ');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // Fetch appointments when a child is selected
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedChild) return;
      
      try {
        setLoading(true);
        const appointmentsData = await appointmentService.getAppointmentsByChildId(selectedChild);
        setAppointments(appointmentsData || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Không thể tải danh sách buổi hẹn');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedChild]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedChild || !selectedAppointment || !description.trim() || !severity) {
        setError('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const reactionData = {
        childId: selectedChild,
        appointmentId: selectedAppointment,
        symptoms: description.trim(),
        severity: severity, // Already in correct format (MILD, MODERATE, SEVERE)
        reactionDate: new Date().toISOString()
      };

        // Debug logs
        console.log('📝 Form Data:', {
            selectedChild,
            selectedAppointment,
            description: description.trim(),
            severity: severity.toUpperCase()
        });
        
        console.log('📦 Reaction Data being sent:', reactionData);
        setLoading(true);
        
        const response = await reactionService.createReaction(reactionData);
        console.log('✅ Response from server:', response);
        
        setShowSuccessMessage(true);
        setError(null);
        
        // Reset form
        setSelectedChild('');
        setSelectedAppointment('');
        setDescription('');
        setSeverity('');
        
        setTimeout(() => {
            setShowSuccessMessage(false);
            navigate('/');
        }, 2000);
    } catch (err) {
        console.error('❌ Error details:', {
            message: err.message,
            error: err
        });
        setError('Không thể gửi báo cáo phản ứng. Vui lòng thử lại sau.');
    } finally {
        setLoading(false);
    }
};

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="form-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        <FaArrowLeft /> Quay lại trang chủ
      </button>
      <h1>Báo Cáo Phản Ứng Sau Tiêm</h1>
      
      {error && <div className="error-message">{error}</div>}
      {showSuccessMessage && (
        <div className="success-message">
          Báo cáo phản ứng đã được gửi thành công!
        </div>
      )}
      
      {showSuccessMessage && submittedReaction && (
      <div className="success-message">
        <h3>Báo cáo phản ứng đã được gửi thành công!</h3>
        <div className="success-details">
          <p><strong>Mã báo cáo:</strong> {submittedReaction.id}</p>
          <p><strong>Trẻ:</strong> {submittedReaction.child.fullName}</p>
          <p><strong>Ngày tiêm:</strong> {new Date(submittedReaction.appointment.appointmentDate).toLocaleDateString()}</p>
          <p><strong>Vắc-xin:</strong> {submittedReaction.appointment.vaccineId.name}</p>
          <p><strong>Triệu chứng:</strong> {submittedReaction.symptoms}</p>
          <p><strong>Mức độ:</strong> {
            submittedReaction.severity === 'MILD' ? 'Nhẹ' :
            submittedReaction.severity === 'MODERATE' ? 'Vừa' :
            submittedReaction.severity === 'SEVERE' ? 'Nặng' : 
            submittedReaction.severity
          }</p>
        </div>
      </div>
    )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Chọn Hồ Sơ Trẻ:</label>
          <select 
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            required
          >
            <option value="">-- Chọn trẻ --</option>
            {children.map(child => (
              <option key={child.childId} value={child.childId}>
                {child.fullName} - {child.childId}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Chọn Buổi Tiêm:</label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            required
            disabled={!selectedChild}
          >
            <option value="">-- Chọn buổi tiêm --</option>
            {appointments.map(app => (
              <option key={app.appId} value={app.appId}>
                {new Date(app.appointmentDate).toLocaleDateString()} - {app.appId}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mô Tả Phản Ứng:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Nhập mô tả chi tiết về phản ứng sau tiêm..."
          />
        </div>

        <div className="form-group">
          <label>Mức Độ:</label>
          <div className="severity-buttons">
            <button
              type="button"
              className={`severity-btn mild ${severity === 'MILD' ? 'active' : ''}`}
              onClick={() => setSeverity('MILD')}
            >
              Nhẹ
            </button>
            <button
              type="button"
              className={`severity-btn moderate ${severity === 'MODERATE' ? 'active' : ''}`}
              onClick={() => setSeverity('MODERATE')}
            >
              Vừa
            </button>
            <button
              type="button"
              className={`severity-btn severe ${severity === 'SEVERE' ? 'active' : ''}`}
              onClick={() => setSeverity('SEVERE')}
            >
              Nặng
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">Gửi Báo Cáo</button>
      </form>
    </div>
  );
};

export default VaccinationReactionForm;