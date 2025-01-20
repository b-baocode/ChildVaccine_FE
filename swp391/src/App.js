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
            <Route path="/register-vaccine" element={<VaccineRegistration />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
