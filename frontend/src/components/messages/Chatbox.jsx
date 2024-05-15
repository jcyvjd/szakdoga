import { useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import { useRoomContext } from "../../context/RoomContext";

const Chatbox = () => {
    const { authUser } = useAuthContext();
    const { rooms } = useRoomContext();
    const roomName = rooms ? rooms.find(room => room._id === authUser.roomId)?.name : null;

    return(
        <div className='h-full w-full flex flex-col border border-gray-300 rounded-lg relative'>
            <div className='bg-slate-500 px-4 py-2 mb-2 rounded-lg'>
                <span className='label-text'>Chat:</span>{" "}
                <span className='text-gray-900 font-bold'>{roomName}</span>
            </div>
            <div className='flex flex-col overflow-y-auto'>
                <div className='mb-auto'>
                    <Messages />
                </div>
                <div className='absolute bottom-0 w-full border-t border-gray-400'>
                    <MessageInput />
                </div>
            </div>
        </div>
    )
}

export default Chatbox;