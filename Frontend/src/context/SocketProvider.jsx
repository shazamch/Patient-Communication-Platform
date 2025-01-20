import React, { createContext, useContext, useMemo, useEffect } from "react";
import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_BASE_URL;  

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};

export const SocketProvider = (props) => {
    // Try to get the existing socket from localStorage or reuse the one already connected
    const socket = useMemo(() => {
        if (window.socket) {
            return window.socket; // Reuse the existing socket if already created
        }
        const newSocket = io(baseURL);
        window.socket = newSocket; // Store the socket globally for reuse
        return newSocket;
    }, []);

    useEffect(() => {
        // Register this app as a web client with the backend (to identify the app instance)
        socket.emit("register-web");

        // Listen for messages
        socket.on('chat message', (data) => {
            console.log('Received message:', data);
            // Here, you can update your state to reflect the message in real-time
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
            delete window.socket; // Remove the socket from global object when disconnected
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};
