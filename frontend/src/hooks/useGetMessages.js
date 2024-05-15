import { useEffect, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { authUser } = useAuthContext();
    const { messages, setMessages } = useChatContext();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/messages/${authUser.roomId}`);
                const data = await response.json();
                if (data.error) throw new Error(data.error);

                console.log("getMessages data:", data);
                setMessages(data);
            } catch (error) {
                toast.error("Error getting messages:", error);
            } finally {
                setLoading(false);
            }
        };

        if(authUser.roomId) getMessages();
    },[setMessages, authUser.roomId])

    return { messages, loading };
}

export default useGetMessages;