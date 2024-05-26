import { useState } from "react";
import { BsSend } from "react-icons/bs";
//import useSendMessage from "../../hooks/useSendMessage";
import useListenMessages from "../../hooks/useListenMessages";

const MessageInput = () => {
    const [message, setMessages] = useState("");
    //const { sendMessage, loading } = useSendMessage();
    const { sendMessage } = useListenMessages();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!message) return;
        console.log("Sending message1: ", message)
        sendMessage(message);
        setMessages("");
    };

    return(
        <form className="" onSubmit={handleSubmit}>
            <div className="w-full relative">
                <input 
                    type="text"
                    className="border text-sm rounded-lg block w-full p-2.5  bg-neutral text-neutral-content" 
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessages(e.target.value)}
                />
                <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
                {/* {loading ? <div className='loading loading-spinner'></div> : <BsSend />} */}
                <BsSend />
                </button>
            </div>
        </form>
    )
};

export default MessageInput;