import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useChatContext } from "../context/ChatContext";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { setMessages, messages } = useChatContext();

    useEffect(() => {
        socket?.on("newMessage", (message) => {
            setMessages([...messages, message]);
        });

        return () => {
            socket?.off("newMessage");
        };
    }, [socket, messages, setMessages]);
};

export default useListenMessages;