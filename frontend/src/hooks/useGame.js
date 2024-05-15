import toast from "react-hot-toast";
import { useGameContext } from "../context/GameContext";


const useGame = () => {
    const { gameState, setGameState } = useGameContext();

    const setupGame = async () => {
        try {
            const response = await fetch(`/api/game/setup`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
            });
            const data = await response.json();
            if(data.error) throw new Error(data.error);

        } catch (error) {
            toast.error(`Error setting up game: ${error.message}`);
        }
    }

    const startGame = async () => {
        try {
          const response = await fetch(`/api/game/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (data.error) throw new Error(data.error);
        } catch (error) {
          toast.error(`Error starting game: ${error.message}`);
        }
      };

      const takeTiles = async (tile, marketId, row) => {
        try {
          const response = await fetch(`/api/game/take`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tile, marketId, row }),
          });
          const data = await response.json();
          if (data.error) throw new Error(data.error);
        } catch (error) {
          toast.error(`Error taking tiles: ${error.message}`);
        }
      };

      const getGame = async (roomId) => {
        try {
          const response = await fetch(`/api/game/get/${roomId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          return data;
        } catch (error) {
          toast.error(`Error getting game: ${error.message}`);
        }
      };

    return {setupGame, startGame, takeTiles, getGame}
}
export default useGame;