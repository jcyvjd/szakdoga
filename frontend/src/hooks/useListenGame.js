import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useGameContext } from "../context/GameContext";
import { useAuthContext } from "../context/AuthContext";
import useJoinRoom from "./useJoinRoom";
import useGame from "./useGame";
import toast from "react-hot-toast";
import { useRoomContext } from "../context/RoomContext";

const useListenGame = () => {
    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();
    const { setGameState, gameState } = useGameContext();
    const {rooms} = useRoomContext();
    const { getGame } = useGame();
    const { getRooms } = useJoinRoom();

    useEffect(() => {
        socket?.on("NewGame", (game) => {
            setGameState(game);
        });

        socket?.on("GetGame", (game) => {
            setGameState(game);
        });

        socket?.on("UpdateGame", (game) => {
            setGameState(game);
        });

        socket?.on("GameOver", (game) => {
            const { gameStatus } = game;
            toast.success("Game Over!");
            if (gameStatus === "ended") {
                setGameState(game);
            }
        });

        return () => {
            socket?.off("NewGame");
            socket?.off("GetGame");
            socket?.off("UpdateGame");
            socket?.off("GameOver");
        };
    }, [socket, gameState, setGameState]);

    useEffect( () => {
        try {
            console.log("Socketes useEffect")
            if(authUser && socket){
                fetchRooms();
                console.log("fetchRooms utan")
                const room = rooms.find(room => room._id === authUser.roomId) || null;
                console.log("SOCKETELES Room: ",room)
                if(room && room.gameId){
                    getGame(room.gameId);
                    console.log("getGame utan")
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    },[socket]);

    useEffect(() => {
        console.log("Updated authUser: ", authUser);
      }, [authUser]);

    const fetchRooms = async() => {
        try {
            await getRooms();
            console.log("fetchRooms utan")
           } catch (error) {
             console.error('Failed to get rooms:', error);
        }
    };
}

export default useListenGame;