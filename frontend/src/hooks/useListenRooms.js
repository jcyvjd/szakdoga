import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useRoomContext } from "../context/RoomContext";
import { useAuthContext } from "../context/AuthContext";
import { useGameContext } from "../context/GameContext";

const useListenRooms = () => {
    const { socket } = useSocketContext();
    const { setRooms, rooms } = useRoomContext();
    const { authUser, setAuthUser } = useAuthContext();
    const { setGameState } = useGameContext();

    useEffect(() => {
        socket?.on("newRoom", (room) => {
            setRooms([room, ...rooms]);
        });
        socket?.on("deleteRoom", (room) => {
            setRooms(rooms.filter((existingRoom) => existingRoom._id !== room._id));
            if (authUser.roomId === room._id) {
                setAuthUser({ ...authUser, roomId: null });
                setGameState(null);
            }
        });
        socket?.on("updateRoom", (room) => {
            setRooms(rooms.map((existingRoom) => {
                if (existingRoom._id === room._id) {
                    return room;
                } else {
                    return existingRoom;
                }
            }));
        });
        socket?.on("getRooms", allRooms => {
            setRooms(allRooms);
        });
        return () => {
            socket?.off("newRoom");
            socket?.off("deleteRoom");
            socket?.off("updateRoom");
            socket?.off("getRooms");
        };
    }, [socket, rooms, setRooms]);
};
export default useListenRooms;



