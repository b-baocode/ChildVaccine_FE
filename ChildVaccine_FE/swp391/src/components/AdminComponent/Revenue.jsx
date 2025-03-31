import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Package, Loader } from 'lucide-react';
import adminService from '../../service/adminService';
import '../../styles/AdminStyles/Revenue.css';

const Revenue = () => {
  const [topVaccines, setTopVaccines] = useState([]); // For chart (top 5)
  const [allVaccines, setAllVaccines] = useState([]); // For table (all vaccines)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data = await adminService.getTop5Vaccines();
        // Transform all data
        const transformedData = data.map(vaccine => ({
          name: vaccine.vaccineName,
          count: vaccine.count,
          price: vaccine.price,
          totalRevenue: vaccine.count * vaccine.price
        }));

        // Sort by count for both arrays
        const sortedData = [...transformedData].sort((a, b) => b.count - a.count);
        
        // Set top 5 for chart
        setTopVaccines(sortedData.slice(0, 5));
        // Set all data for table
        setAllVaccines(sortedData);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch vaccines:', error);
        setError('Failed to load vaccine data');
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  const formatCurrency = (value) => {
    return `${value.toLocaleString('vi-VN')}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-count">
            <span className="label">Số lượng:</span> {payload[0].value}
          </p>
          <p className="tooltip-revenue">
            <span className="label">Doanh thu:</span> {payload[1].value.toLocaleString('vi-VN')}đ
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="loading-container">
      <Loader className="loading-spinner" />
      <p>Đang tải dữ liệu...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <span className="error-icon">⚠️</span>
      <p>{error}</p>
    </div>
  );

  const totalRevenue = topVaccines.reduce((sum, vaccine) => sum + vaccine.totalRevenue, 0);
  const totalCount = topVaccines.reduce((sum, vaccine) => sum + vaccine.count, 0);

  return (
    <div className="revenue-container">
      <h2 className="page-title">Thống kê doanh thu Vaccine</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Tổng số lượng</h3>
            <p>{totalCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>Tổng doanh thu dự kiến</h3>
            <p>{totalRevenue.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
      </div>

      <div className="revenue-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h3><TrendingUp size={20} /> Top 5 Vaccine bán chạy nhất</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topVaccines} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ marginTop: '20px' }} />
              <Bar
                yAxisId="left"
                dataKey="count"
                fill="#4CAF50"
                name="Số lượng"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="totalRevenue"
                fill="#2196F3"
                name="Doanh thu"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="revenue-table">
          <div className="table-header">
            <h3>Chi tiết doanh thu theo Vaccine</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Vaccine</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {allVaccines.map((vaccine, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{vaccine.name}</td>
                    <td className="text-center">{vaccine.count}</td>
                    <td className="text-right">{vaccine.price.toLocaleString('vi-VN')}đ</td>
                    <td className="text-right highlight">
                      {vaccine.totalRevenue.toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;