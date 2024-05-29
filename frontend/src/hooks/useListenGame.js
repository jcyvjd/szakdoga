import { useState, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useGameContext } from "../context/GameContext";
import { useAuthContext } from "../context/AuthContext";
import {
  animateRoundOver,
  animateTakeTiles,
  animatePlayerLeft,
} from "../utils/AnimateChanges";

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
          break;
        case "NewRound":
            setGameState(data);
          break;
        case "GameOver":
            setTimeout(() => {
                setGameState(data);
            }, 5000);
          break;
        case "RoundOver":
          animateRoundOver(gameState, data);
          setTimeout(() => {
            setGameState((prevState) => ({
              ...prevState,
              playerBoards: data.playerBoards,
            }));
          }, 500);
          break;
        case "TakeTiles":
            setGameState((prevState) => ({
                ...prevState,
                markets: data.markets
            }));
            animateTakeTiles(gameState, data);
          setTimeout(() => {
            setGameState((prevState) => ({
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
        case "PlayerLeftGame":
          animatePlayerLeft(gameState, data);
          setGameState(data);
          break;
        default:
          break;
      }
      setTimeout(() => {
        setEventQueue((prevQueue) => prevQueue.slice(1));
      }, 500);
    }
  };

  useEffect(() => {
    processEvent();
  }, [eventQueue]);

  useEffect(() => {
    const handleEvent = (type, data) => {
      setEventQueue((prevQueue) => [...prevQueue, { type, data }]);
    };

    socket?.on("NewGame", (game) => handleEvent("NewGame", game));
    socket?.on("GetGame", (game) => handleEvent("GetGame", game));
    socket?.on("UpdateGame", (game) => handleEvent("UpdateGame", game));
    socket?.on("NewRound", (game) => handleEvent("NewRound", game));
    socket?.on("GameOver", (game) => handleEvent("GameOver", game));
    socket?.on("RoundOver", (game) => handleEvent("RoundOver", game));
    socket?.on("TakeTiles", (data) => handleEvent("TakeTiles", data));
    socket?.on("PlayerLeftGame", (data) => handleEvent("PlayerLeftGame", data));

    return () => {
      socket?.off("NewGame");
      socket?.off("GetGame");
      socket?.off("UpdateGame");
      socket?.off("GameOver");
      socket?.off("TakeTiles");
      socket?.off("RoundOver");
      socket?.off("NewRound");
      socket?.off("PlayerLeftGame");
    };
  }, [socket]);
};

export default useListenGame;
