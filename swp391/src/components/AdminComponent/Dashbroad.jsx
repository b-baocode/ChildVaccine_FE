import React from 'react';
import { Users, Calendar, DollarSign, Activity } from 'lucide-react';
import '../../styles/Dashboard.css';

const Dashboard = () => {
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
            <div className="card-value">150</div>
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
            <div className="card-value">45</div>
            <div className="card-date">
              <span className="trend-up">↑ 5% so với hôm qua</span>
            </div>
          </div>
          <div className="card-icon green">
            <Calendar size={24} />
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3>Doanh thu tháng</h3>
            <div className="card-value">₫125M</div>
            <div className="card-date">
              <span className="trend-down">↓ 3% so với tháng trước</span>
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
              <span className="trend-up">↑ 8% so với tháng trước</span>
            </div>
          </div>
          <div className="card-icon red">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Rest of your dashboard content */}
    </div>
  );
};

export default Dashboard;