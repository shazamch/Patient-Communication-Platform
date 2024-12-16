import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import chatMiddleware from '../../../redux/middleware/chatMiddleware';
import CrossButton from "../../../elements/crossButton/CrossButton";

const ChatSidebar = ({ onSelectChat, isDarkMode, allusers, LoggedInUserDate }) => {
    const dispatch = useDispatch();
    const chatStack = useSelector((state) => state.chatStack); // Retrieve chat stack from Redux store
    const [searchTerm, setSearchTerm] = useState('');
    const [newchatopen, setNewchatopen] = useState(false);
    const [recentChatStack, setRecentChatStack] = useState([]);

    useEffect(() => {
        // Dispatch the GetChatStack middleware action to fetch the chat stack
        dispatch(chatMiddleware.GetChatStack(LoggedInUserDate._id.toString()))
            .then((response) => {
                if (response.success) {
                    // If the response is successful, update the chatStack
                    setRecentChatStack(response.data); // Adjust according to your response structure
                }
            })
            .catch((error) => {
                // Handle error if needed
                console.error("Error fetching chat stack:", error);
            });
    }, [dispatch, newchatopen]);

    useEffect(() => {
        if (chatStack && chatStack.length > 0) {
            setRecentChatStack(chatStack);
        }
    }, [chatStack]);

    const formatUpdatedAt = (updatedAt) => {
        const updatedDate = new Date(updatedAt);
        const currentDate = new Date();

        const isToday = updatedDate.toDateString() === currentDate.toDateString();

        if (isToday) {
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            return updatedDate.toLocaleTimeString([], options);
        } else {
            const year = updatedDate.getFullYear();
            const month = String(updatedDate.getMonth() + 1).padStart(2, '0');
            const day = String(updatedDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    };

    const handleNewChat = () => {
        setNewchatopen(true);
        setRecentChatStack(chatStack);
    };

    const closeNewChat = () => {
        setNewchatopen(false);
        setSearchTerm('');
    };

    const displayedChats = newchatopen ? allusers.sort((a, b) => a.name.localeCompare(b.name)) : recentChatStack;

    const filteredChats = displayedChats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`p-2 flex flex-col h-[calc(100vh-115px)] border-r border-gray-150 rounded-l-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300 text-black'}`}
            />

            {/* Title: Recent Chats or Start New Chat */}
            <div className="flex justify-between items-center mt-4">
                <h2 className={`text-lg font-semibold border-b ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {newchatopen ? 'Start New Chat' : 'Recent Chats'}
                </h2>
                {newchatopen && (
                    <CrossButton
                    onClick={closeNewChat}
                    className="text-gray-500 hover:text-gray-700"
                  />
                )}
            </div>

            {/* Chats List with Scrolling */}
            <div className="mt-2 flex-1 overflow-y-auto relative">
                {filteredChats && filteredChats.length === 0 ? (
                    <p className={`text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>No chats found.</p>
                ) : (
                    filteredChats.map((chat, index) => (
                        <div
                            key={index}
                            className={`flex items-center p-2 rounded-md cursor-pointer border-b ${isDarkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-200'}`}
                            onClick={() => onSelectChat(chat._id)}
                        >
                            <img src={chat.profilephoto} alt={chat.name} className="h-10 w-10 rounded-full mr-2" />
                            <div className="flex-1">
                                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{chat.name}</p>
                            </div>
                            {!newchatopen && (
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {formatUpdatedAt(chat.lastMessage)}
                                </span>
                            )}
                        </div>
                    ))
                )}
                {!newchatopen && (
                    <button
                        className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
                        onClick={handleNewChat}
                    >
                        +
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
