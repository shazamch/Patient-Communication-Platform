import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import messageMiddleware from '../../../redux/middleware/messageMiddleware';
import { useSocket } from "../../../context/SocketProvider";

function Footer({ isDarkMode, receiverData, LoggedUser, conversationId }) {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch(); // Use dispatch to send actions
  const socket = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const ReceiverId = receiverData._id;

      const messageData = {
        message: message,
        conversationId,
        senderName: LoggedUser.name,
        senderId: LoggedUser._id,
        receiverid: ReceiverId,
        timestamp: new Date().toISOString(),
      };
      socket.emit('chat message', { ReceiverId, messageData });
      // Dispatch action to send the message
      const response = await dispatch(messageMiddleware.sendMessage(ReceiverId, messageData));

      if (response.success) {
        if (LoggedUser._id === messageData.senderId){
          console.log('Message sent successfully.');
        }
      } else {
        console.error('Failed to send message:', response.message);
      }

      setMessage(''); // Clear the input field
    }
  };

  useEffect(() => {
    // You can listen for incoming messages, if needed
  }, []);

  return (
    <footer className={`flex justify-between items-center py-2 px-8 rounded-full shadow-[0px_4px_10px_rgba(0,0,0,0.1)] ${isDarkMode ? 'bg-white text-black' : 'bg-white text-black'}`}>
      <form onSubmit={handleSubmit} className="flex w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`flex-grow p-2 rounded-l-lg focus:outline-none ${isDarkMode ? 'bg-white text-balck' : 'bg-gray-200 text-black'}`}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-full ml-1 bg-myblue text-white`}
        >
          Send
        </button>
      </form>
    </footer>
  );
}

export default Footer;
