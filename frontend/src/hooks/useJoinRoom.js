import {useState} from 'react'
import { useRoomContext } from '../context/RoomContext.jsx'
import { useAuthContext } from '../context/AuthContext'
import { useGameContext } from '../context/GameContext.jsx'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'



const useJoinRoom = () => {
    const {setRooms} = useRoomContext();
    const [loading, setLoading] = useState(false);
    const {authUser, setAuthUser} = useAuthContext();
    const {setGameState} = useGameContext();
    const navigate = useNavigate();

    const joinRoom = async (room, password) => {
        console.log("joinRoom: ", room.name, password)
        setLoading(true);
        try {
            const response = await fetch("/api/rooms/join/" + room._id, {
                method:"POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({roomId: room._id, password})
            })
            const data = await response.json()
            if(response.ok){
                setAuthUser({...authUser, roomId: data._id});
                navigate(`/session/${room._id}`);
                setGameState(null);
            } else{
                throw new Error(response.statusText)
            }
        } catch (error) {
            toast.error("Failed to join the room")
            console.error("Failed to join room:", error)
            return
        }finally{
            setLoading(false);
        }
    }

    const leaveRoom = async (room) => {
        setLoading(true);
        try {
            const response = await fetch("/api/rooms/leave/" + room._id, {
                method:"POST",
                headers: {"Content-Type" : "application/json"},
            })
            const data = await response.json()
    
            if(response.ok){
                setAuthUser({...authUser, roomId: null});
                setGameState(null);
                navigate(`/`);
            }else{
                throw new Error(response.statusText)
            }
        } catch (error) {
            throw new Error(response.statusText)
        }finally{
            setLoading(false);
        }
    }

    const getRooms = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/rooms", {
                method:"GET",
                headers: {"Content-Type" : "application/json"},
            })
            const data = await response.json()
            console.log("getRooms data: ", data)
            if(response.ok){
                setRooms(data);
            } else{
                throw new Error(response.statusText)
            }
        } catch (error) {
            console.error("Failed to get rooms:", error)
            return
        }finally{
            setLoading(false);
        }
    }

    return { joinRoom, leaveRoom, getRooms, loading}
}

export default useJoinRoom
