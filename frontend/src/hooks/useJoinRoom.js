import { useState } from 'react';
import { useRoomContext } from '../context/RoomContext.jsx';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import useLogout from './useLogout.js';

const useJoinRoom = () => {
    const { setRooms } = useRoomContext();
    const [loading, setLoading] = useState(false);
    const { authUser, setAuthUser } = useAuthContext();
    const { setGameState } = useGameContext();
    const { logout } = useLogout();
    const navigate = useNavigate();

    const handleTokenExpiredError = () => {
        toast.error("Session expired. Please log in again.");
        logout();
    };

    const joinRoom = async (room, password) => {
        setLoading(true);
        try {
            const response = await fetch("/api/rooms/join/" + room._id, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: room._id, password })
            });
            const data = await response.json();
            if (response.ok) {
                setAuthUser({ ...authUser, roomId: data._id });
                navigate(`/session/${room._id}`);
                setGameState(null);
            } else {
                if (data.code === "TOKEN_EXPIRED") {
                    handleTokenExpiredError();
                } else {
                    throw new Error(data.error || "Failed to join room");
                }
            }
        } catch (error) {
            toast.error("Failed to join the room");
            console.error("Failed to join room:", error);
        } finally {
            setLoading(false);
        }
    };

    const leaveRoom = async (room) => {
        setLoading(true);
        try {
            const response = await fetch("/api/rooms/leave/" + room._id, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                setAuthUser({ ...authUser, roomId: null });
                setGameState(null);
                navigate(`/`);
            } else {
                if (data.code === "TOKEN_EXPIRED") {
                    handleTokenExpiredError();
                } else {
                    throw new Error(data.error || "Failed to leave room");
                }
            }
        } catch (error) {
            toast.error("Failed to leave the room");
            console.error("Failed to leave room:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRooms = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/rooms", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                setRooms(data);
            } else {
                if (data.code === "TOKEN_EXPIRED") {
                    handleTokenExpiredError();
                } else {
                    throw new Error(data.error || "Failed to get rooms");
                }
            }
        } catch (error) {
            toast.error("Failed to get rooms");
            console.error("Failed to get rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    return { joinRoom, leaveRoom, getRooms, loading };
};

export default useJoinRoom;
