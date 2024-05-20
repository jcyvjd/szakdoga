import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useGameContext } from "../context/GameContext";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useListenGame = () => {
    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();
    const { setGameState, gameState } = useGameContext();

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
}

export default useListenGame;