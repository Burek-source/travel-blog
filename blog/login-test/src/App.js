// src/App.js
/*import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import TravelLogsPage from './pages/TravelLogsPage';
import JourneyPlansPage from './pages/JourneyPlansPage';
import Navbar from './components/Navbar';

function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Navbar user={user} />
            <Routes>
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                <Route path="/travel-logs" element={user ? <TravelLogsPage /> : <Navigate to="/login" />} />
                <Route path="/journey-plans" element={user ? <JourneyPlansPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;*/

// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import TravelLogsPage from './pages/TravelLogsPage';
import JourneyPlansPage from './pages/JourneyPlansPage';
import Navbar from './components/Navbar';
import SignUpPage from './pages/SignUpPage';


function App() {
    const [user, setUser] = useState(null);

    // Use localStorage to persist user state across refreshes
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));  // If user is found in localStorage, set it
        }
    }, []);

    // Function to handle user login (set user and store in localStorage)
    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));  // Store user data in localStorage
    };

    // Function to handle logout (clear user data from state and localStorage)
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');  // Remove user data from localStorage
    };

    return (
        <Router>
            <Navbar user={user} onLogout={handleLogout} />  {/* Pass onLogout to Navbar */}
            <Routes>
                <Route path="/login" element={<LoginPage setUser={handleLogin} />} />
                <Route path="/profile" element={<ProfilePage user={user} setUser={handleLogin} />} />
                <Route path="/travel-logs" element={user ? <TravelLogsPage /> : <Navigate to="/login" />} />
                <Route path="/journey-plans" element={user ? <JourneyPlansPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} />} />
                <Route path="/signup" element={<SignUpPage />} />

            </Routes>
        </Router>
    );
}

export default App;

