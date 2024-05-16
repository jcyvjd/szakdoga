import { useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import { useRoomContext } from "../../context/RoomContext";
import { Collapse, Ripple, initTWE } from "tw-elements";

initTWE({ Collapse, Ripple });

const Chatbox = () => {
  const { authUser } = useAuthContext();
  const { rooms } = useRoomContext();
  const roomName = rooms
    ? rooms.find((room) => room._id === authUser.roomId)?.name
    : null;

  return (
    <div className="rounded-lg">
      <button
        className=" md:hidden inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
        type="button"
        data-twe-collapse-init
        data-twe-ripple-init
        data-twe-ripple-color="light"
        data-twe-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        Chat
      </button>
      <div className="h-full hidden md:block" id="collapseExample" data-twe-collapse-item>
        <div className="bg-neutral text-neutral-content px-4 py-2 mb-2 rounded-lg">
          <span className="">Chat:</span>{" "}
          <span className="font-bold">{roomName}</span>
        </div>
        <div className="flex flex-col overflow-y-auto">
          <div className="h-3/5">
            <Messages />
          </div>
          <div className="w-full border-t border-gray-400">
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
