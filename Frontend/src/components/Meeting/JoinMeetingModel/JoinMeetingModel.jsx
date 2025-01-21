import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../../context/SocketProvider';
import { useNavigate } from 'react-router-dom';

function JoinMeetingModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const socket = useSocket();

    const handleSubmit = (e) => {
        if (!email || !roomNumber) {
            alert('Please fill in both fields.');
            return;
        }
        e.preventDefault();
        socket.emit('room:join', { email, roomNumber });
    };

    const handleJoin = useCallback((data) => {
      const { email, roomNumber } = data;
      navigate(`/lobby/${roomNumber}`);
  }, [navigate]);

    useEffect(() => {
        socket.on("room:join", handleJoin);
        return () => {
            socket.off("room:join", handleJoin);
        };
    }, [socket]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
          <h1 className="text-2xl font-bold mb-4 text-center">Join a Meeting</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="roomNumber"
              >
                Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                placeholder="Enter room number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center">
                <button
                    type="button"
                    onClick={(e) => handleSubmit(e)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Join
                </button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default JoinMeetingModal;
