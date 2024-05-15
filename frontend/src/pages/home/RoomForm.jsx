import React, { useState } from 'react'
import { useRoomContext } from '../../context/RoomContext'
import { useAuthContext } from '../../context/AuthContext'
import useJoinRoom from '../../hooks/useJoinRoom'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const RoomForm = () => {
  const {rooms, setRooms} = useRoomContext()
  const {authUser} = useAuthContext()
  const { joinRoom } = useJoinRoom()

  const [roomName, setRoomName] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!authUser){
      //setError('You must be logged in')
      return
    }

    const room = {name:roomName}

    const response = await fetch("/api/rooms",{
      method:"POST",
      body: JSON.stringify(room),
      headers: {"Content-Type":"application/json"}
    })
    const json = await response.json()

    if(!response.ok){
      return toast.error("Couldn't host the room:(")
    }
    
    if(response.ok){
      await joinRoom(json);
      setRoomName('')
      setRooms([...rooms, json])
    }
  }


  return (
    <div className="w-96 bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <h3 className="text-lg font-semibold mb-4">Add a New Room</h3>
            <div className="mb-4 w-full">
                <label className="block text-gray-700">Room name:</label>
                <input 
                    placeholder='Room Name'
                    type="text"
                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Create Room </button>
            
        </form>
    </div>
  )
}

export default RoomForm
