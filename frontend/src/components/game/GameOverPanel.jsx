import React from 'react';
import useJoinRoom from '../../hooks/useJoinRoom';
import { useRoomContext } from '../../context/RoomContext';
import { useAuthContext } from '../../context/AuthContext';

const GameOverPanel = ({ playerBoards }) => {
  const { leaveRoom, loading } = useJoinRoom();
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
    <div className="overflow-x-auto w-4/5 mx-auto transform scale-125">
      <h1 className='text-4xl text-blue-500 mb-4 text-center'>Game Over!</h1>
      <table className="table w-full">
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
              <tr key={index} className="">
                <th>{index + 1}</th>
                <td>{player.playerId.username}</td>
                <td>{player.points}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        onClick={handleLeaveRoom}
        className={`mt-4 w-2/3 px-4 py-2 rounded transition-all duration-200 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'} mx-auto block`}
        disabled={loading}
      >
        {loading ? 
          <div className="loading loading-spinner"></div> 
        : 
          ('Accept')}
      </button>
    </div>
  );
};

export default GameOverPanel;