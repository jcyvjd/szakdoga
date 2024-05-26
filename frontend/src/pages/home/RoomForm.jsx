import React, { useState, useEffect } from "react";
import { useRoomContext } from "../../context/RoomContext";
import { useAuthContext } from "../../context/AuthContext";
import useJoinRoom from "../../hooks/useJoinRoom";
import toast from "react-hot-toast";

const RoomForm = () => {
  const { rooms, setRooms } = useRoomContext();
  const { authUser } = useAuthContext();
  const { joinRoom } = useJoinRoom();

  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isLargeScreen) {
      setShowPasswordInput(true);
    } else {
      setShowPasswordInput(false);
    }
  }, [isLargeScreen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      return;
    }

    const room = { name: roomName, password };

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
      authUser.roomId = json._id;
      await joinRoom(json, password);
      setRoomName("");
      setPassword("");
      setRooms([...rooms, json]);
    }
  };

  return (
    <div className="md:mx-auto md:my-auto md:w-1/2 bg-primary text-primary-content rounded-lg shadow-md p-4 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full">
        <h3 className="text-lg font-semibold mb-4">Add a New Room</h3>
        <div className="mb-4">
          <label htmlFor="roomName" className="text-base-100-content mb-2 block">
            Room Name
          </label>
          <input
            id="roomName"
            placeholder="Enter room name"
            type="text"
            className="w-full p-2 border placeholder-base-100-content bg-base-100 border-base-content text-base-100-content rounded-md"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        {showPasswordInput ? (
          <div className="mb-4">
            <label htmlFor="password" className="text-base-100-content mb-2 block">
              Password (Optional)
            </label>
            <input
              id="password"
              placeholder="Enter password"
              type="password"
              className="w-full p-2 border placeholder-base-100-content bg-base-100 border-base-content text-base-100-content rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {!isLargeScreen && (
              <div
                className="text-sm text-neutral-content cursor-pointer mt-2"
                onClick={() => setShowPasswordInput(false)}
              >
                Remove Password
              </div>
            )}
          </div>
        ) : (
          !isLargeScreen && (
            <div
              className="text-sm text-neutral-content cursor-pointer mb-4"
              onClick={() => setShowPasswordInput(true)}
            >
              Add Password
            </div>
          )
        )}

        <button className="bg-neutral text-neutral-content py-2 px-4 rounded-md">
          Create Room
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
