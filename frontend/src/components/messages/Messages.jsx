import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
    const { messages, loading } = useListenMessages();
	useListenMessages();
    const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
		console.log("Updated messages state:", messages);
	}, [messages]);

    return(
        <div className='px-4 flex-1 min-h-60 max-h-60 overflow-y-auto no-scrollbar'>
            {!loading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef} className="break-all">
						<Message message={message} />
					</div>
			))}
        </div>
    )
}

export default Messages;