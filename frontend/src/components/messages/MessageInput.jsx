import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useListenMessages from "../../hooks/useListenMessages";

const MessageInput = () => {
    const [message, setMessages] = useState("");
    const { sendMessage } = useListenMessages();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!message) return;
        sendMessage(message);
        setMessages("");
    };

    return(
        <form className="" onSubmit={handleSubmit}>
            <div className="w-full relative">
                <input 
                    type="text"
                    className="border text-sm rounded-lg block w-full p-2.5 pr-10 bg-neutral text-neutral-content" 
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessages(e.target.value)}
                />
                <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
                <BsSend  className="text-white"/>
                </button>
            </div>
        </form>
    )
};

export default MessageInput;