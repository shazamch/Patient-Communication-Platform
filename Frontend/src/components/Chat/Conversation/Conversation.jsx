import React, { useState, useEffect, useRef } from 'react';
import ComingSoonSplash from '../../CommingSoonSplash/CommingSoonSplash';
import AudioCall from '../../../assets/AudioCall.svg';
import VideoCall from '../../../assets/VideoCall.svg';
import ProfileDetails from '../../ProfileDetails/ProfileDetails';
import notification from '../../../assets/notification.mp3'
import Footer from '../Footer/Footer';
import { useSocket } from "../../../context/SocketProvider";


function Conversation({ isDarkMode, conversationToRender, setconversationToRender, LoggedUser, otherUserData }) {
    const socket = useSocket();
    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSplash, setShowSplash] = useState(false);
    const messagesEndRef = useRef(null);
    const [lineClamp, setLineClamp] = useState(2);

    const handleAudioCall = () => {
        setShowSplash(true);
        setTimeout(() => {
            setShowSplash(false);
        }, 500);
    };

    const handleVideoCall = () => {
        setShowSplash(true);
        setTimeout(() => {
            setShowSplash(false);
        }, 500);
    };

    const handleProfileClick = (userData) => {
        if (userData) {
            setSelectedUser(userData);
            setShowProfileDetails(true);
        }
    };

    // Scroll to the bottom whenever conversationToRender updates
    useEffect(() => {
        scrollToBottom();
    }, [conversationToRender]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const formatDate = (isoString) => {
        // Convert ISO string to Date object
        const date = new Date(isoString);

        // Extract year, month, and day
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Return formatted date in YYYY-MM-DD format
    };

    useEffect(() => {
        // Listen for incoming chat messages
        socket.on('chat message', (messageData) => {
            if (messageData.ReceiverId.toString() === LoggedUser._id.toString()) {
                const sound = new Audio(notification);
                sound.play();
            }            
            // Reformat messageData
            const formattdmessageData = {
                id: messageData.message.id, // Assuming there's an id property
                message: messageData.message.message, // Retain the message content
                sender: messageData.message.sender,
                userId: messageData.message.senderid,
                time: formatDate(messageData.message.timestamp)
                // Add any other necessary fields from messageData
            };

            // Update messages state with the new message
            setconversationToRender((prevMessages) => [...prevMessages, formattdmessageData]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('chat message');
        };
    }, []);

    return (
        <div className={`chat-container rounded-r-lg h-[calc(100vh-115px)] w-[calc(100vw-355px)] ${isDarkMode ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-black'} p-4`}>
            <div className='bg-blue-50 rounded-lg p-1 mb-2 flex items-center justify-between'>
                <h2 className="text-lg font-semibold flex items-center text-black cursor-pointer" onClick={() => handleProfileClick(otherUserData)}>
                    <img 
                        src={otherUserData.profilephoto} 
                        alt={`${otherUserData.name}'s profile`} 
                        className="h-8 w-8 rounded-full mr-2" 
                    />
                    {otherUserData.name}
                </h2>
                <div className="flex items-center space-x-2 ml-auto">
                    <button onClick={handleAudioCall} className="bg-transparent p-2 rounded hover:bg-gray-200 transition">
                        <img src={AudioCall} alt="Audio Call" className="h-6 w-6" />
                    </button>
                    <button onClick={handleVideoCall} className="bg-transparent p-2 rounded hover:bg-gray-200 transition">
                        <img src={VideoCall} alt="Video Call" className="h-6 w-6" />
                    </button>
                </div>
            </div>
            {showSplash && <ComingSoonSplash />}
            {showProfileDetails && <ProfileDetails userData={selectedUser} onClose={() => setShowProfileDetails(false)} isDarkMode={isDarkMode} />}
            <div className="chat-messages flex flex-col h-[484px] overflow-y-auto pr-2 scrollbar-hide">
                {conversationToRender.map((message, index) => {
                    const uniqueKey = message.id || `${message.sender}-${message.timestamp}-${index}`;
                    const messageUserData = message.sender === otherUserData.name
                        ? otherUserData
                        : LoggedUser;

                    const maxLineClamp = 9999999999; // Maximum number of lines to display

                    const toggleLines = () => {
                        setLineClamp((prev) => (prev < maxLineClamp ? maxLineClamp : 2)); // Switch between 2 and maxLineClamp
                    };

                    const isLongMessage = message.message.split(' ').length > 15;

                    const showMore = lineClamp < maxLineClamp; // Shows "Show More" if current lines are less than max

                    return (
                        <div 
                            key={uniqueKey} 
                            className={`message mb-4 p-2 rounded-md max-w-[40%] ${
                                message.userId === LoggedUser._id 
                                    ? 'bg-blue-600 text-white self-end rounded-br-none' 
                                    : 'bg-gray-700 text-white self-start rounded-bl-none'
                            }`}
                        >
                            <div className="flex items-center cursor-pointer" onClick={() => handleProfileClick(messageUserData)}>
                                <img 
                                    src={messageUserData.profilephoto} 
                                    alt={`${messageUserData.name}'s profile`} 
                                    className="h-6 w-6 rounded-full mr-2"
                                />
                                <span className="font-semibold">{messageUserData.name}</span>
                            </div>
                            <div className={`line-clamp-${lineClamp}`}>{message.message}</div>
                            {isLongMessage && (
                                <button 
                                    onClick={toggleLines} 
                                    className="text-xs text-white mt-1 underline hover:text-blue-400 focus:outline-none focus:ring-0 bg-transparent border-none text-left px-0"
                                >
                                    {showMore ? 'Show More' : 'Show Less'}
                                </button>
                            )}
                            <div className="text-xs text-right py-0.5">{message.time}</div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <Footer isDarkMode receiverData={otherUserData} LoggedUser={LoggedUser} /> {/* Footer added here */}
        </div>
    );
}

export default Conversation;
