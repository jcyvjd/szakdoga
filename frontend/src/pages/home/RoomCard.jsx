import React, {useEffect, useState} from 'react'
import { useRoomContext } from '../../context/RoomContext'
import { useAuthContext } from '../../context/AuthContext'
import { FiLogIn, FiTrash } from 'react-icons/fi';
import useJoinRoom  from '../../hooks/useJoinRoom.js';
import useGame from '../../hooks/useGame.js';

const RoomCard = ({room}) => {

  const {rooms,setRooms} = useRoomContext()
  const {authUser, setAuthUser} = useAuthContext()
  const {joinRoom, deleteRoom , loading} = useJoinRoom();
  const { getGame } = useGame();

  const handleJoinRoom = async () => {
    if(!authUser){
      return
    }
    
    await joinRoom(room);
  }

  const handleDeleteRoom = async () => {
    if(!authUser){
      return
    }
    await deleteRoom(room);
  }

  
  const canJoin = room && (room.gameId === null) && (room.users.length < 4);
  const status = canJoin ? 'Waiting' : 'Game in progress';

  return (
    <div className="bg-neutral text-neutral-content rounded-lg shadow-md p-4 w-full md:w-1/2 flex flex-col">
      <h4 className="text-primary text-xl font-semibold mb-2">{room.name}</h4>
      <p className="mb-2">{status}</p>
      <p className="mb-2">
        {room &&  `${room.users.length} / 4 players`}
      </p>

      <div className="flex justify-end items-center mt-auto">
        {/* Icon for join button */}
        <button
          onClick={handleJoinRoom}
          className={`bg-primary text-primary-content py-2 px-4 rounded-md items-center ${!canJoin ? 'cursor-not-allowed bg-opacity-50' : ''}`}
          disabled={canJoin ? false : true}
        >
          {loading ? <div className='loading loading-spinner'></div> : <div><FiLogIn className="mr-1" /> Join</div>}
        </button>

        {/* Icon for delete button */}
        {/* {authUser && room.owner === authUser._id && (
          <button onClick={handleDeleteRoom} className="ml-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center">
            {loading ? <div className='loading loading-spinner'></div> : <div><FiTrash className="mr-1" /> Delete</div> }
          </button>
        )} */}
      </div>
    </div>
  );
}

export default RoomCard