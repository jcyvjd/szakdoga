import { useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import { useRoomContext } from "../../context/RoomContext";

const Chatbox = () => {
  const { authUser } = useAuthContext();
  const { rooms } = useRoomContext();
  const roomName = rooms
    ? rooms.find((room) => room._id === authUser.roomId)?.name
    : null;

    return (
        <div className="flex flex-col bg-base-200 text-base-content" >
          <div className="bg-neutral text-neutral-content px-4 py-2 rounded-lg">
            <span className="">Chat:</span>{" "}
            <span className="font-bold">{roomName}</span>
          </div>
          <div className="pt-2 flex-grow flex flex-col">
            
              <Messages />
              
              <MessageInput />
          </div>
        </div>
    );
};

export default Chatbox;
