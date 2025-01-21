import React, { useState, useEffect, useRef } from 'react';
import ComingSoonSplash from '../../CommingSoonSplash/CommingSoonSplash';
import AudioCall from '../../../assets/AudioCall.svg';
import VideoCall from '../../../assets/VideoCall.svg';
import ProfileDetails from '../../ProfileDetails/ProfileDetails';
import notification from '../../../assets/notification.mp3'
import Footer from '../Footer/Footer';
import { useSocket } from "../../../context/SocketProvider";
import MessageOptionsDropdown from './MessageOptionsDropdown'
import TaskModal from '../../Task/TaskModel';
import MessageOptionsIcon from "../../../assets/customIcons/genearlIcons/options_vertical.svg"


function Conversation({ isDarkMode, conversationToRender, setconversationToRender, LoggedUser, otherUserData }) {
    const socket = useSocket();
    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSplash, setShowSplash] = useState(false);
    const messagesEndRef = useRef(null);
    const [lineClamp, setLineClamp] = useState(2);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskReferenceMessage, setTaskReferenceMessage] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleMakeTaskClick = (message) => {
        setTaskReferenceMessage(message);
        setIsTaskModalOpen(true);
    };

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
                console.log("Message Recevied", messageData)
                const sound = new Audio(notification);
                sound.play();
            }

            // Reformat messageData
            const formattedMessageData = {
                id: messageData.messageData?.timestamp,
                message: messageData.messageData?.message,
                senderName:messageData.messageData?.senderName,
                senderId:messageData.messageData?.senderId,
                time:formatDate(messageData.messageData?.timestamp)
            };            

            if (messageData.messageData?.conversationId === conversationToRender.conversationId){
                console.log("Message Added to CONVO")
                setconversationToRender((prevConversation) => ({
                    ...prevConversation,
                    messages: [...prevConversation.messages, formattedMessageData],
                }));
            }
        });

        // Cleanup on component unmount
        return () => {
            socket.off('chat message');
        };
    }, []);

return (
    <div
        className={`chat-container rounded-r-3xl h-[calc(100vh-25px)] w-[calc(100vw-320px)] ${
            isDarkMode ? "bg-gray-800 text-white shadow-lg" : "bg-transparent text-black"
        } p-4`}
    >
        {/* Header */}
        <div className="bg-white rounded-full p-1 mb-2 flex items-center justify-between shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
            <h2
                className="text-lg font-semibold flex items-center text-black cursor-pointer"
                onClick={() => handleProfileClick(otherUserData)}
            >
                <img
                    src={otherUserData.profilephoto}
                    alt={`${otherUserData.name}'s profile`}
                    className="h-8 w-8 rounded-full mr-2"
                />
                {otherUserData.name}
            </h2>
            <div className="flex items-center space-x-2 ml-auto">
                <button
                    onClick={handleAudioCall}
                    className="bg-transparent p-2 rounded hover:bg-gray-200 transition"
                >
                    <img src={AudioCall} alt="Audio Call" className="h-6 w-6" />
                </button>
                <button
                    onClick={handleVideoCall}
                    className="bg-transparent p-2 rounded hover:bg-gray-200 transition"
                >
                    <img src={VideoCall} alt="Video Call" className="h-6 w-6" />
                </button>
            </div>
        </div>

        {/* Splash and Profile Details */}
        {showSplash && <ComingSoonSplash />}
        {showProfileDetails && (
            <ProfileDetails
                userData={selectedUser}
                onClose={() => setShowProfileDetails(false)}
                isDarkMode={isDarkMode}
            />
        )}

        {/* Messages Section */}
        <div className="chat-messages flex flex-col h-[calc(100vh-180px)] overflow-y-auto pr-2 scrollbar-hide">
            {conversationToRender.messages.map((message, index) => {
                const uniqueKey =
                    message.id || `${message.sender}-${message.timestamp}-${index}`;
                const messageUserData =
                    message.senderName === otherUserData.name
                        ? otherUserData
                        : LoggedUser;

                const maxLineClamp = 9999999999;
                const toggleLines = () => {
                    setLineClamp((prev) =>
                        prev < maxLineClamp ? maxLineClamp : 2
                    );
                };
                const isLongMessage = message.message.split(' ').length > 15;
                const showMore = lineClamp < maxLineClamp;

                const isSender = message.senderId === LoggedUser._id;

                return (
                    <div
                        key={uniqueKey}
                        className={`flex items-start mb-4 group relative ${
                            isSender ? 'self-end' : 'self-start'
                        }`}
                    >
                        {/* For Sent Messages (Right-Aligned) */}
                        {isSender && (
                            <div className="flex items-center mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="relative">
                                    <button
                                        className="p-1 hover:bg-gray-200 rounded-full focus:outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDropdownOpen(!dropdownOpen);
                                        }}
                                    >
                                        <img
                                            src={MessageOptionsIcon}
                                            alt="Options"
                                            className="h-3 w-3"
                                        />
                                    </button>
                                    {dropdownOpen && (
                                        <MessageOptionsDropdown dropdownPosition="right"
                                            onMakeTaskClick={() => {
                                                handleMakeTaskClick(message);
                                                setDropdownOpen(false);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Message container */}
                        <div
                            className={`message p-2 rounded-md shadow-[0px_4px_10px_rgba(0,0,0,0.1)] ${
                                isSender
                                    ? 'bg-myblue text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-none'
                                    : 'bg-white text-black rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-xl'
                            } relative`}
                        >
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() =>
                                    handleProfileClick(messageUserData)
                                }
                            >
                                <img
                                    src={messageUserData.profilephoto}
                                    alt={`${messageUserData.name}'s profile`}
                                    className="h-6 w-6 rounded-full mr-2"
                                />
                                <span className="font-semibold">
                                    {messageUserData.name}
                                </span>
                            </div>

                            <div
                                className={`line-clamp-${lineClamp}`}
                            >
                                {message.message}
                            </div>

                            {isLongMessage && (
                                <button
                                    onClick={toggleLines}
                                    className="text-xs text-white mt-1 underline hover:text-blue-400 focus:outline-none focus:ring-0 bg-transparent border-none text-left px-0"
                                >
                                    {showMore ? 'Show More' : 'Show Less'}
                                </button>
                            )}

                            <div className="text-xs text-right py-0.5">
                                {message.time}
                            </div>
                        </div>

                        {/* For Received Messages (Left-Aligned) */}
                        {!isSender && (
                            <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="relative">
                                    <button
                                        className="p-1 hover:bg-gray-200 rounded-full focus:outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDropdownOpen(!dropdownOpen);
                                        }}
                                    >
                                        <img
                                            src={MessageOptionsIcon}
                                            alt="Options"
                                            className="h-3 w-3"
                                        />
                                    </button>
                                    {dropdownOpen && (
                                        <MessageOptionsDropdown dropdownPosition="left"
                                            onMakeTaskClick={() => {
                                                handleMakeTaskClick(message);
                                                setDropdownOpen(false);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <div ref={messagesEndRef} />
        </div>

        {/* Footer Section */}
        <Footer isDarkMode receiverData={otherUserData} LoggedUser={LoggedUser} conversationId={conversationToRender.conversationId} />

        {/* Task Modal */}
        {isTaskModalOpen && (
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setTaskReferenceMessage(null);
                }}
                referenceMessage={taskReferenceMessage}
                isDarkMode={isDarkMode}
            />
        )}
    </div>
);    
    
}

export default Conversation;
