import React, { useState } from "react";
import { useRoomContext } from "../../context/RoomContext";
import { useAuthContext } from "../../context/AuthContext";
import useJoinRoom from "../../hooks/useJoinRoom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RoomForm = () => {
  const { rooms, setRooms } = useRoomContext();
  const { authUser } = useAuthContext();
  const { joinRoom } = useJoinRoom();

  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      //setError('You must be logged in')
      return;
    }

    const room = { name: roomName };

    const response = await fetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify(room),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();

    if (!response.ok) {
      return toast.error("Couldn't host the room:(");
    }

    if (response.ok) {
      await joinRoom(json);
      setRoomName("");
      setRooms([...rooms, json]);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-primary text-primary-content rounded-lg shadow-md p-4 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full">
        <h3 className="text-lg font-semibold mb-4">Add a New Room</h3>
        <input
          placeholder="Room Name"
          type="text"
          className="w-full mb-4 p-2 border placeholder-base-100-content bg-base-100 border-base-content text-base-100-content rounded-md"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="bg-neutral text-neutral-content py-2 px-4 rounded-md">
          Create Room
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
