import React, { createContext, useContext, useMemo, useEffect } from "react";
import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_BASE_URL;  

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};

export const SocketProvider = (props) => {
    const socket = useMemo(() => io(baseURL), []);

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};
