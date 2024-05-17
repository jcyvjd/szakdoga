import { useAuthContext } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import { useRoomContext } from "../../context/RoomContext";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { rooms } = useRoomContext();

    return (
        <div className={`message ${authUser.id === message.senderId ? "sent" : "received"}`}>
            <p><i>{message.senderName}</i>: {message.message}</p>
        </div>
    );
}

export default Message;