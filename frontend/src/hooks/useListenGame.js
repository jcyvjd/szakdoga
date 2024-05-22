import { useState, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useGameContext } from "../context/GameContext";
import { useAuthContext } from "../context/AuthContext";
import { animateRoundOver, animateTakeTiles} from "../utils/AnimateChanges";
import toast from "react-hot-toast";

const useListenGame = () => {
    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();
    const { setGameState, gameState } = useGameContext();

    useEffect(() => {
        socket?.on("NewGame", (game) => {
            //setGameState(game);
        });

        socket?.on("GetGame", (game) => {
            //setGameState(game);
        });

        socket?.on("UpdateGame", (game) => {
            //setGameState(game);
        });

        socket?.on("GameOver", (game) => {
            const { gameStatus } = game;
            toast.success("Game Over!");
            if (gameStatus === "ended") {
                setGameState(game);
            }
        });

        socket?.on("RoundOver", (game) => {
            animateRoundOver(gameState, game);
            setTimeout(() => {
                setGameState(game);
              }, 500); // Delay the state update to allow the animation to complete
        });
        

        socket?.on("TakeTiles", (data) => {
            animateTakeTiles(gameState, data);
            setTimeout(() => {
                setGameState(data);
              }, 500); // Delay the state update to allow the animation to complete
        })

        return () => {
            socket?.off("NewGame");
            socket?.off("GetGame");
            socket?.off("UpdateGame");
            socket?.off("GameOver");
            socket?.off("TakeTiles");
        };
    }, [socket, gameState, setGameState]);

    return null;
}

export default useListenGame;
