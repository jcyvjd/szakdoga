import React from 'react';
import useJoinRoom from '../../hooks/useJoinRoom';
import { useRoomContext } from '../../context/RoomContext';
import { useAuthContext } from '../../context/AuthContext';

const GameOverPanel = ({ playerBoards }) => {
  const { leaveRoom } = useJoinRoom();
  const { rooms } = useRoomContext();
  const { authUser } = useAuthContext();

  const room = rooms.find((room) => room._id === authUser.roomId);

  const handleLeaveRoom = async () => {
    if (!authUser) {
      return;
    }
    await leaveRoom(room);
  };

  return (
    <div className="w-full max-w-md bg-gray-200 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Game Over</h2>
      <div>
        {playerBoards
          .slice()
          .sort((a, b) => b.points - a.points)
          .map((player, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{index + 1}. {player.playerId.username}</span>
              <span>Points: {player.points}</span>
            </div>
          ))}
      </div>
      <button
        onClick={handleLeaveRoom}
        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Accept
      </button>
    </div>
  );
};

export default GameOverPanel;