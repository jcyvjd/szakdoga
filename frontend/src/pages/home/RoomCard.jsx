import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { FiLogIn, FiLock, FiUnlock } from 'react-icons/fi';
import useJoinRoom from '../../hooks/useJoinRoom.js';

const RoomCard = ({ room }) => {
  const { authUser } = useAuthContext();
  const { joinRoom, loading } = useJoinRoom();
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    if (!authUser) {
      return;
    }

    if (room.hasPassword && password === '') {
      setShowPasswordInput(true);
      return;
    }

    if(!room.hasPassword) {
      await joinRoom(room, null);
      return;
    }
    console.log('Joining room:', room.name, password);
    await joinRoom(room, password);
  };

  const canJoin = room && room.gameId === null && room.users.length < 4;
  const status = canJoin ? 'Waiting' : 'Game in progress';

  return (
    <div className="bg-neutral text-neutral-content rounded-lg shadow-md p-4 w-full md:w-1/2 flex flex-col">
      <h4 className="text-primary text-xl font-semibold mb-2">{room.name}</h4>
      <p className="mb-2">{status}</p>
      <p className="mb-2">{room.users.length} / 4 players</p>

      <form onSubmit={handleJoinRoom} className="flex justify-end items-center mt-auto">
        {room.hasPassword && (
          <div
            className="relative w-full overflow-hidden mr-2"
            onMouseEnter={() => setShowPasswordInput(true)}
            onMouseLeave={() => !isPasswordInputFocused && setShowPasswordInput(false)}
          >
            {showPasswordInput ? (
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordInputFocused(true)}
                onBlur={() => setIsPasswordInputFocused(false)}
                className="p-2 border placeholder-neutral-content bg-primary border-primary-content text-primary-content rounded-md max-w-full"
                autoComplete="new-password"
              />
            ) : (
              <FiLock
                className="text-white cursor-pointer"
                onClick={() => setShowPasswordInput(true)}
              />
            )}
          </div>
        )}
        {!room.hasPassword && <FiUnlock className="text-primary-content mr-2" />}

        <button
          type="submit"
          className={`bg-primary text-primary-content py-2 px-4 rounded-md items-center ${
            !canJoin ? 'cursor-not-allowed bg-opacity-50' : ''
          }`}
          disabled={!canJoin}
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <div>
              <FiLogIn className="mr-1" /> Join
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default RoomCard;