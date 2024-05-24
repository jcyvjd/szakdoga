import { useState, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useGameContext } from "../context/GameContext";
import { useAuthContext } from "../context/AuthContext";
import { animateRoundOver, animateTakeTiles} from "../utils/AnimateChanges";
import toast from "react-hot-toast";
import { set } from "mongoose";

const useListenGame = () => {
    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();
    const { setGameState, gameState } = useGameContext();
    const [eventQueue, setEventQueue] = useState([]);

    const processEvent = () => {
        if (eventQueue.length > 0) {
            const { type, data } = eventQueue[0];
            switch (type) {
                case "NewGame":
                    setGameState(data);
                case "NewRound":
                    //animateNewRound(gameState, data);
                    setGameState(data);
                case "GameOver":
                    setGameState(data);
                    break;
                case "RoundOver":
                    animateRoundOver(gameState, data);
                    setTimeout(() => {
                        setGameState(prevState => ({
                            ...prevState,
                            playerBoards: data.playerBoards
                        }));
                    }, 500);
                    break;
                case "TakeTiles":
                    animateTakeTiles(gameState, data);
                    setTimeout(() => {
                        setGameState(prevState => ({
                            ...prevState,
                            markets: data.markets,
                            sharedMarket: data.sharedMarket,
                            playerBoards: data.playerBoards,
                            playerToMove: data.playerToMove,
                        }));
                    }, 500);
                    break;
                case "GetGame":
                    setGameState(data);
                    break;
                case "UpdateGame":
                    setGameState(data);
                    break;
                default:
                    break;
            }
            setTimeout(() => {
                setEventQueue(eventQueue.slice(1));
            }, 500);
        }
    };

    useEffect(() => {
        processEvent();
    }, [eventQueue]);

    useEffect(() => {
        const handleEvent = (type, data) => {
            setEventQueue([...eventQueue, { type, data }]);
        };

        socket?.on("NewGame", (game) => handleEvent("NewGame", game));
        socket?.on("GetGame", (game) => handleEvent("GetGame", game));
        socket?.on("UpdateGame", (game) => handleEvent("UpdateGame", game));
        socket?.on("NewRound", (game) => handleEvent("NewRound", game));
        socket?.on("GameOver", (game) => handleEvent("GameOver", game));
        socket?.on("RoundOver", (game) => handleEvent("RoundOver", game));
        socket?.on("TakeTiles", (data) => handleEvent("TakeTiles", data));

        return () => {
            socket?.off("NewGame");
            socket?.off("GetGame");
            socket?.off("UpdateGame");
            socket?.off("GameOver");
            socket?.off("TakeTiles");
            socket?.off("RoundOver");
            socket?.off("NewRound");
        };
    }, [socket, gameState, setGameState]);

    return null;
}

export default useListenGame;