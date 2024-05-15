import { createContext, useContext, useState } from 'react';
import { useAuthContext } from './AuthContext'; // Import your AuthContext

// Create the ChatContext
const ChatContext = createContext();

// Custom hook to use the ChatContext
export const useChatContext = () => useContext(ChatContext);

// ChatProvider component to wrap your application
export const ChatContextProvider = ({ children }) => {
  const { authUser } = useAuthContext(); // Access authUser from AuthContext

  // State for chat messages
  const [messages, setMessages] = useState([]);

  // Value object to provide to consumers
  const value = {
    roomId: authUser ? authUser.roomId : null,
    messages,
    setMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};