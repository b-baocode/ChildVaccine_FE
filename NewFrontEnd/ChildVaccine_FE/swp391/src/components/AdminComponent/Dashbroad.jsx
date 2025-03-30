import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Activity } from 'lucide-react';
import '../../styles/AdminStyles/Dashboard.css';
import adminService from '../../service/adminService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [staffCount, setStaffCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Starting dashboard data fetch...');
            
            const [staffCountData, appointmentsData, revenueData] = await Promise.all([
                adminService.getStaffCount(),
                adminService.getTodayAppointmentsCount(),
                adminService.getRevenue()
            ]);
            
            console.log('Received data:', {
                staffCount: staffCountData,
                appointments: appointmentsData,
            });
            
            setStaffCount(staffCountData);
            setTodayAppointments(appointmentsData);
            setRevenue(revenueData);
        } catch (error) {
            console.error('Dashboard Error:', {
                message: error.message,
                response: error.response,
                status: error.response?.status
            });
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to load dashboard data'
            );
        } finally {
            setLoading(false);
        }
    };

    fetchDashboardData();
}, []);


  if (error) {
    return <div className="error-message">{error}</div>;
  }


  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, Admin</p>
      </div>

      <div className="analytics-cards">
        <div className="card">
          <div className="card-content">
            <h3>Tổng số nhân viên</h3>
            <div className="card-value">{staffCount}</div>
            <div className="card-date">
              <span className="trend-up">↑ 12% so với tháng trước</span>
            </div>
          </div>
          <div className="card-icon blue">
            <Users size={24} />
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3>Lịch hẹn hôm nay</h3>
            <div className="card-value">{todayAppointments}</div>
            <div className="card-date">
              <span className="trend-up"></span>
            </div>
          </div>
          <div className="card-icon green">
            <Calendar size={24} />
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3>Tổng doanh thu</h3>
            <div className="card-value">{revenue} VND</div>
            <div className="card-date">
              <span className="trend-down"></span>
            </div>
          </div>
          <div className="card-icon yellow">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3>Tổng số mũi tiêm</h3>
            <div className="card-value">1,250</div>
            <div className="card-date">
              <span className="trend-up"></span>
            </div>
          </div>
          <div className="card-icon red">
            <Activity size={24} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;