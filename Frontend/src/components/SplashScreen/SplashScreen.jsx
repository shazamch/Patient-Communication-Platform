import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/MainLogo.svg';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-white text-black">
        <img src={logo} alt="Main Logo" className="h-64 w-64 mb-6" />
        <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
            Patient Communication Platform
        </h1>
        <p className="text-2xl font-light text-gray-700 italic drop-shadow-md tracking-wide">
            Your Voice, Amplified
        </p>
    </div>
  );
}

export default SplashScreen;