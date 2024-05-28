import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if(authUser){
            const socket = io(import.meta.env.VITE_APP_SERVER_URL, {
				query: {
					userId: authUser._id,
				},
			});

            setSocket(socket);

            return () => {socket.close()};
        }else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    },[authUser]);

    return (
        <SocketContext.Provider value={{socket}}> {children}</SocketContext.Provider>
    );
};
