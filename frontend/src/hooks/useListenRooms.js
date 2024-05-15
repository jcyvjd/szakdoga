import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useRoomContext } from "../context/RoomContext";

const useListenRooms = () => {
    const { socket } = useSocketContext();
    const { setRooms, rooms } = useRoomContext();

    useEffect(() => {
        socket?.on("newRoom", (room) => {
            setRooms([room, ...rooms]);
        });

        socket?.on("deleteRoom", (room) => {
            setRooms(rooms.filter((existingRoom) => existingRoom._id !== room._id));
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