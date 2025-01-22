// pages/Chat/Chat.jsx
import React, { useState, useEffect } from 'react';
import MeetingSidebar from '../../components/Meeting/MeetingSidebar/MeetingSidebar';
import logo from '../../assets/MainLogo.svg';
import { useDispatch, useSelector } from 'react-redux';
import JoinMeetingModal from '../../components/Meeting/JoinMeetingModel/JoinMeetingModel'

function Meeting({ children, onLogout, isDarkMode, toggleDarkMode }) {
  const Data = localStorage.getItem("user");
  const LoggedInUserDate = JSON.parse(Data);
  const dispatch = useDispatch();
  const [showSplash, setShowSplash] = useState(true)

  // Function to check which conversation belongs to the selected userId and set the selected conversation
  const onSelectChat = (userId) => {
    setShowSplash(false);
  };

  return (
    <div className="flex bg-mylightblue shadow-lg rounded-3xl p-2">
      <MeetingSidebar onSelectChat={onSelectChat} isDarkMode={isDarkMode} />
      <div className="flex-grow w-80 h-[calc(100vh-30px)]">
        {showSplash !== true ? (
          <>
            <div className="flex">
              <div className="flex">{children}</div>
              <JoinMeetingModal
        isOpen={() => setShowSplash(false)}
        onClose={() => setShowSplash(true)}
      />

            </div>
          </>
        ) : (
          <div className={`flex flex-col justify-center items-center h-[calc(100vh-25px)] rounded-r-lg ${isDarkMode ? 'bg-transparent text-white' : 'bg-transparent text-black'}`}>
            <img src={logo} alt="Main Logo" className={`h-24 w-24 mb-6 ${isDarkMode ? 'filter invert' : ''}`} />
            <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
              Patient Communication Platform
            </h1>
            <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-700'} drop-shadow-md tracking-wide`}>
              Your Voice, Amplified
            </p>
            </div>
        )}
      </div>
    </div>
  );
}

export default Meeting;
