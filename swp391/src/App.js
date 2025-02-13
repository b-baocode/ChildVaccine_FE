import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
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

import StaffLayout from './layouts/StaffLayout';
import AppointmentInfo from './components/StaffComponent/AppointmentInfo';
import PostVaccinationInfo from './components/StaffComponent/PostVaccinationInfo';
import CustomerProfiles from './components/StaffComponent/CustomerProfiles';
import ChildProfilesList from './components/StaffComponent/StaffChildProfiles';

import AdminLayout from './layouts/AdminLayout';
import Dashbroad from './components/AdminComponent/Dashbroad';
import StaffManagement from './components/AdminComponent/StaffManagement';
import VaccinationHistory from './components/AdminComponent/VaccinationHistory';
import Feedback from './components/AdminComponent/Feedback';
import Revenue from './components/AdminComponent/Revenue';

import Profile from './components/CusComponent/Profile';
import AddChildForm from './components/CusComponent/AddChildForm';
import ChildProfiles from './components/ChildProfiles';
import PaymentReview from './components/PaymentReview';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/handbook" element={<Handbook />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/disease" element={<Disease />} />
            <Route path="/news" element={<News />} />
            <Route path="/register-vaccination" element={<VaccineRegistration />} />
            <Route path="/feedback" element={<CusFeedback />} />
            <Route path="/react-report" element={<VaccinationReactionForm />} />

            <Route path="/staff" element={<StaffLayout />}>
              <Route path="appointment-info" element={<AppointmentInfo />} />
              <Route path="post-vaccination-info" element={<PostVaccinationInfo />} />
              <Route path="child-profiles" element={<ChildProfilesList />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashbroad />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="vaccination-history" element={<VaccinationHistory />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="revenue" element={<Revenue />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-child" element={<AddChildForm />} />
            <Route path="/payment-review" element={<PaymentReview />} />
            <Route path="/child-profiles" element={<ChildProfiles />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
