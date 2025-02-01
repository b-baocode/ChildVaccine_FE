import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../../styles/AdminStyles/Revenue.css';

const Revenue = () => {
  // Data mẫu cho biểu đồ
  const vaccineRevenueData = [
    { name: 'Vaccine 6 trong 1', revenue: 450000000, count: 150 },
    { name: 'Vaccine 5 trong 1', revenue: 380000000, count: 127 },
    { name: 'Vaccine Viêm gan B', revenue: 280000000, count: 140 },
    { name: 'Vaccine Rotavirus', revenue: 250000000, count: 100 },
    { name: 'Vaccine Pneumo', revenue: 220000000, count: 88 },
  ];

  // Data cho bảng thống kê
  const revenueStats = {
    totalRevenue: 1580000000,
    totalVaccinations: 605,
    averagePerVaccination: 2611570,
    comparisonLastMonth: 15.7 // % tăng so với tháng trước
  };

  // Data chi tiết theo tháng
  const monthlyData = [
    {
      vaccineType: 'Vaccine 6 trong 1',
      currentMonth: 450000000,
      lastMonth: 380000000,
      growth: 18.4,
      count: 150
    },
    {
      vaccineType: 'Vaccine 5 trong 1',
      currentMonth: 380000000,
      lastMonth: 350000000,
      growth: 8.6,
      count: 127
    },
    {
      vaccineType: 'Vaccine Viêm gan B',
      currentMonth: 280000000,
      lastMonth: 260000000,
      growth: 7.7,
      count: 140
    },
    {
      vaccineType: 'Vaccine Rotavirus',
      currentMonth: 250000000,
      lastMonth: 220000000,
      growth: 13.6,
      count: 100
    },
    {
      vaccineType: 'Vaccine Pneumo',
      currentMonth: 220000000,
      lastMonth: 200000000,
      growth: 10.0,
      count: 88
    }
  ];

  return (
    <div className="revenue-container">
      {/* Thống kê tổng quan */}
      <div className="revenue-summary">
        <div className="summary-card">
          <h3>Tổng doanh thu</h3>
          <div className="value">{revenueStats.totalRevenue.toLocaleString()}đ</div>
          <div className="comparison">
            <span className="positive">+{revenueStats.comparisonLastMonth}%</span> so với tháng trước
          </div>
        </div>
        <div className="summary-card">
          <h3>Tổng số mũi tiêm</h3>
          <div className="value">{revenueStats.totalVaccinations}</div>
        </div>
        <div className="summary-card">
          <h3>Trung bình/mũi tiêm</h3>
          <div className="value">{revenueStats.averagePerVaccination.toLocaleString()}đ</div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="revenue-charts">
        <div className="chart-container">
          <h3>Top 5 vaccine doanh thu cao nhất</h3>
          <BarChart width={600} height={300} data={vaccineRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu (VNĐ)" />
          </BarChart>
        </div>
        <div className="chart-container">
          <h3>Top 5 vaccine số lượng tiêm cao nhất</h3>
          <BarChart width={600} height={300} data={vaccineRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="Số lượng tiêm" />
          </BarChart>
        </div>
      </div>

      {/* Bảng chi tiết */}
      <div className="revenue-table">
        <h3>Chi tiết doanh thu theo loại vaccine</h3>
        <table>
          <thead>
            <tr>
              <th>Loại Vaccine</th>
              <th>Doanh thu tháng này</th>
              <th>Doanh thu tháng trước</th>
              <th>Tăng trưởng</th>
              <th>Số lượng tiêm</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((item, index) => (
              <tr key={index}>
                <td>{item.vaccineType}</td>
                <td>{item.currentMonth.toLocaleString()}đ</td>
                <td>{item.lastMonth.toLocaleString()}đ</td>
                <td className={item.growth >= 0 ? 'positive' : 'negative'}>
                  {item.growth > 0 ? '+' : ''}{item.growth}%
                </td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Revenue;