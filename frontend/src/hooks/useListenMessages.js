import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { setMessages, messages } = useChatContext();
    const { authUser } = useAuthContext();

    useEffect(() => {
        if(authUser.roomId){
            socket?.emit("getMessages", {roomId: authUser.roomId});
        }
    }, [socket, authUser.roomId]);

    useEffect(() => {
        socket?.on("newMessage", (message) => {
            setMessages([...messages, message]);
        });

        socket?.on("getMessages", (messages) => {
            setMessages(messages);
        });

        return () => {
            socket?.off("newMessage");
            socket?.off("getMessages");
        };
    }, [socket, messages, setMessages, authUser.roomId]);

    const sendMessage = (message) => {
        if(!message) return;
        if(!authUser.roomId) return;
        socket?.emit("sendMessage", { receiverId: authUser.roomId, message});
    };
    
    return {sendMessage, messages};
};

export default useListenMessages;