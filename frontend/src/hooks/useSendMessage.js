import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import { useChatContext } from "../context/ChatContext"
import toast from "react-hot-toast";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const {authUser} = useAuthContext();
    const {messages, setMessages} = useChatContext();

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/messages/send/${authUser.roomId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            //setMessages([...messages, data.message]);
            //setMessages(prevMessages => [...prevMessages, data]);
        } catch (error) {
            toast.error(`Error sending message: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return {sendMessage, loading}
}

export default useSendMessage
