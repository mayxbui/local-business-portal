import './App.css';
import React from 'react';
import LogIn from './components/log-in/log-in.jsx';
import Locals from './components/locals/locals.jsx';
import Home from './components/home/home.jsx';
import NavBar from './components/nav-bar/nav-bar.jsx';
import Register from './components/register.jsx';
import Scan from './components/scan/scan.jsx';
import Deals from './components/deals/deals.jsx';
import UploadData from './components/upload-data.jsx';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useUser,UserProvider } from './components/contexts/user-context.jsx';

function AppWrapper() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

function AppContent() {
  const { UserDetails, loading } = useUser(); // now it works
  const location = useLocation();
  const hideNavBarOn = ['/login', '/register'];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="App">
      {UserDetails && !hideNavBarOn.includes(location.pathname) && <NavBar />}

      <Routes>
        <Route path="/" element={UserDetails ? <Navigate to="/home" /> : <LogIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/locals" element={<Locals />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/deals" element={<Deals />} />
        {/* <Route path="/upload" element={<UploadData />} /> */}
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default AppWrapper;