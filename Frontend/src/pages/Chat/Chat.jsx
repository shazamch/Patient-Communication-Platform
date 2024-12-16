// pages/Chat/Chat.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Chat/ChatSidebar/ChatSidebar';
import Conversation from '../../components/Chat/Conversation/Conversation';
import logo from '../../assets/MainLogo.svg';
import { useDispatch, useSelector } from 'react-redux';
import chatMiddleware from '../../redux/middleware/chatMiddleware'; // Import middleware

function Chat({ children, onLogout, isDarkMode, toggleDarkMode }) {
  const Data = localStorage.getItem("user");
  const LoggedInUserDate = JSON.parse(Data);
  const dispatch = useDispatch();
  const [conversationToRender, setconversationToRender] = useState("Splash");
  const [SelectFromStack, setSelectedFromStack] = useState([]);
  const [allusers, setAllusers] = useState([]);

  // Fetch all users using chatMiddleware
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await dispatch(chatMiddleware.GetAllUsers());
        if (response.success) {
          setAllusers(response.data);
        } else {
          console.error("All Users Fetch Failed");
        }
      } catch (error) {
        console.error("All Users Fetch Failed:", error);
      }
    };

    fetchAllUsers();
  }, [dispatch]);

  // Fetch conversation for a specific userId using chatMiddleware
  const fetchConversation = async (userId1, userId2) => {
    try {
      const response = await dispatch(chatMiddleware.FindConversation(userId1,userId2));
      if (response.success) {
        setconversationToRender(response.data); // Assuming the response has 'conversation' field
      } else {
        console.error(`Fetch conversation failed for user ${userId}`);
      }
    } catch (error) {
      console.error(`Fetch conversation failed for user ${userId}:`, error);
    }
  };

  // Function to check which conversation belongs to the selected userId and set the selected conversation
  const onSelectChat = (userId) => {
    fetchConversation(LoggedInUserDate._id,userId);
    const selectedUserData = allusers.find(chat => chat._id === userId);
    setSelectedFromStack(selectedUserData);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setconversationToRender("Splash");
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex bg-white shadow-lg rounded-lg">
      <Sidebar onSelectChat={onSelectChat} isDarkMode={isDarkMode} allusers={allusers} LoggedInUserDate={LoggedInUserDate} />
      <div className="flex-grow w-full h-[calc(100vh-115px)]">
        {conversationToRender !== "Splash" ? (
          <>
            <div className="flex">
              <div className="flex">{children}</div>
              <Conversation isDarkMode={isDarkMode} conversationToRender={conversationToRender} setconversationToRender={setconversationToRender} LoggedUser={LoggedInUserDate} otherUserData={SelectFromStack} />
            </div>
          </>
        ) : (
          <div className={`flex flex-col justify-center items-center h-[calc(100vh-115px)] rounded-r-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
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

export default Chat;
