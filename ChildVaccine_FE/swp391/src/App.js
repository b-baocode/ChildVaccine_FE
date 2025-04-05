import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import './styles/Home.css';
import About from './components/About';
import Handbook from './components/Handbook';
import PriceList from './components/PriceList';
import Disease from './components/Disease';
import News from './components/News';
import VaccineRegistration from './components/VaccineRegistration';
import VaccinationReactionForm from './components/VaccinationReactionForm';
import CusFeedback from './components/CusComponent/Feedback';
import ForgotPassword from './components/ForgotPassword';

import StaffLayout from './layouts/StaffLayout';
import AppointmentInfo from './components/StaffComponent/AppointmentInfo';
import PostVaccinationInfo from './components/StaffComponent/PostVaccinationInfo';
import ChildProfilesList from './components/StaffComponent/StaffChildProfiles';
import ScheduleInfo from './components/StaffComponent/ScheduleInfo';
import ScheduleDetail from './components/StaffComponent/ScheduleDetail';
import AppointmentOverdue from './components/StaffComponent/AppointmentOverdue';

import AdminLayout from './layouts/AdminLayout';
import Dashbroad from './components/AdminComponent/Dashbroad';
import StaffManagement from './components/AdminComponent/StaffManagement';
import VaccinationHistory from './components/AdminComponent/VaccinationHistory';
import Feedback from './components/AdminComponent/Feedback';
import Revenue from './components/AdminComponent/Revenue';
import VaccineManage from'./components/AdminComponent/VaccineManage';

import Profile from './components/CusComponent/Profile';
import AddChildForm from './components/CusComponent/AddChildForm';
import ChildProfiles from './components/ChildProfiles';
import PaymentReview from './components/PaymentReview';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentResult from './components/CusComponent/PaymentResult';

const AppWrapper = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/handbook" element={<Handbook />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/disease" element={<Disease />} />
            <Route path="/news" element={<News />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/success" element={<PaymentResult />} />
            <Route path="/failed" element={<PaymentResult />} />
            
            {/* Customer Protected routes */}
            <Route path="/register-vaccination" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <VaccineRegistration />
              </ProtectedRoute>
            } />
            <Route path="/react-report" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <VaccinationReactionForm />
              </ProtectedRoute>
            } />
            <Route path="/child-profiles" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <ChildProfiles />
              </ProtectedRoute>
            } />
            <Route path="/add-child" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <AddChildForm />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute roles={['CUSTOMER', 'STAFF', 'ADMIN']}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/payment-review" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <PaymentReview />
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <CusFeedback />
              </ProtectedRoute>
            } />

            {/* Staff routes */}
            <Route path="/staff" element={
              <ProtectedRoute roles={['STAFF']}>
                <StaffLayout />
              </ProtectedRoute>
            }>
              <Route path="appointment-info" element={<AppointmentInfo />} />
              <Route path="appointment-overdue" element={<AppointmentOverdue />} />
              <Route path="post-vaccination-info" element={<PostVaccinationInfo />} />
              <Route path="child-profiles" element={<ChildProfilesList />} />
              <Route path="schedule-info" element={<ScheduleInfo />} />
              <Route path="/staff/schedules/:scheduleId" element={<ScheduleDetail />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashbroad />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="vaccination-history" element={<VaccinationHistory />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="vaccineManage" element={<VaccineManage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;
