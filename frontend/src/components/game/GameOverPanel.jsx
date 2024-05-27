import React from 'react';
import useJoinRoom from '../../hooks/useJoinRoom';
import { useRoomContext } from '../../context/RoomContext';
import { useAuthContext } from '../../context/AuthContext';
import useListenRooms from '../../hooks/useListenRooms';

const GameOverPanel = ({ playerBoards }) => {
  console.log("GAMEOVER playerBoards: ", playerBoards);
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
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {playerBoards
            .slice()
            .sort((a, b) => b.points - a.points)
            .map((player, index) => (
              <tr key={index} className="hover">
                <th>{index + 1}</th>
                <td>{player.playerId.username}</td>
                <td>{player.points}</td>
              </tr>
            ))}
        </tbody>
      </table>
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