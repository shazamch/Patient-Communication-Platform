import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import Layout from "./components/Navigation/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Chat from "./pages/Chat/Chat";
import Meetings from "./pages/Meeting/Meeting";
import MyProfile from "./components/Navigation/myProfile/MyProfile";
import Lobby from "./components/Meeting/Lobby/Lobby";
import Toast from './elements/toast/Toast'
import MyErrorBoundary, { NotFoundPage } from "./components/errorPage/ErrorBoundary"; 
import Appointments from "./pages/Appointments/Appointments"
import Tasks from "./pages/Tasks/Tasks"


function App() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <MyErrorBoundary>
    <Router>
      {/* <Toast /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
            )
          }
        />
        <Route path="/signup" element={<SignupPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>}/>

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<PrivateRoute isLoggedIn={isAuthenticated}><Layout><Dashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/></Layout></PrivateRoute>}/>
        <Route path="/chat" element={<PrivateRoute isLoggedIn={isAuthenticated}><Layout><Chat isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/></Layout></PrivateRoute>}/>
        <Route path="/meetings" element={<PrivateRoute isLoggedIn={isAuthenticated}><Layout><Meetings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/></Layout></PrivateRoute>}/>
        <Route path="/lobby/:roomNumber" element={<PrivateRoute isLoggedIn={isAuthenticated}><Layout><Lobby isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/></Layout></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute isLoggedIn={isAuthenticated}><Layout><Appointments isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/></Layout></PrivateRoute>}/>
        <Route path="/tasks" element={<PrivateRoute isLoggedIn={isAuthenticated}><Layout><Tasks isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/></Layout></PrivateRoute>}/>
        
        <Route path="/myprofile" element={<PrivateRoute isLoggedIn={isAuthenticated}><Layout><MyProfile  isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/></Layout></PrivateRoute>}/>
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
    </MyErrorBoundary>
  );
}

// PrivateRoute ensures restricted access for authenticated users
function PrivateRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default App;
