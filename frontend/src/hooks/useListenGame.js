import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
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

        const handleTileMove = (data) => {
            const { from, to } = data;
            const { marketId, index: fromIndex } = from;
            const { playerBoardId, type: toType, index: toIndex } = to;

            // Get the fromElement based on the marketId and fromIndex
            const fromElement = document.getElementById(`market-${marketId}-tile-${fromIndex}`);

            let toElementId;
            if (toType === 'collected') {
                const rowIndex = Math.floor(toIndex / 10);
                const colIndex = toIndex % 10;
                toElementId = `playerBoard-${playerBoardId}-col-${rowIndex}-tile-${colIndex}`;
            } else if (toType === 'wall') {
                const rowIndex = Math.floor(toIndex / 10);
                const colIndex = toIndex % 10;
                toElementId = `playerBoard-${playerBoardId}-wall-${rowIndex}-tile-${colIndex}`;
            } else if (toType === 'floor') {
                toElementId = `playerBoard-${playerBoardId}-floor-tile-${toIndex}`;
            }

            const toElement = document.getElementById(toElementId);

            if (fromElement && toElement) {
                const fromRect = fromElement.getBoundingClientRect();
                const toRect = toElement.getBoundingClientRect();

                // Create a temporary element for the animation
                const tempTile = fromElement.cloneNode(true);
                tempTile.style.position = 'absolute';
                tempTile.style.top = `${fromRect.top}px`;
                tempTile.style.left = `${fromRect.left}px`;
                tempTile.style.width = `${fromRect.width}px`;
                tempTile.style.height = `${fromRect.height}px`;
                document.body.appendChild(tempTile);

                // Animate the tile movement
                tempTile.animate([
                    { transform: `translate(${toRect.left - fromRect.left}px, ${toRect.top - fromRect.top}px)` }
                ], {
                    duration: 500,
                    easing: 'ease-in-out'
                }).onfinish = () => {
                    document.body.removeChild(tempTile);
                    // You might want to update the game state here to reflect the new tile position
                };
            }
        };

        socket?.on("MoveTile", handleTileMove);

        return () => {
            socket?.off("NewGame");
            socket?.off("GetGame");
            socket?.off("UpdateGame");
            socket?.off("GameOver");
            socket?.off("MoveTile", handleTileMove);
        };
    }, [socket, gameState, setGameState]);

    return null;
}

export default useListenGame;
