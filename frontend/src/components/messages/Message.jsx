import { useAuthContext } from "../../context/AuthContext";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();

    return (
        <div className={`message ${authUser._id === message.senderId ? "sent" : "received"}`}>
            <p><i>{message.senderName}</i>: {message.message}</p>
        </div>
    );
}

export default Message;