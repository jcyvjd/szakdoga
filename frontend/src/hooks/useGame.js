import { useSocketContext } from "../context/SocketContext";

const useGame = () => {
    const { socket } = useSocketContext();

    const setupGame = async (roomId) => {
        socket.emit("SetupGame", { roomId });
      };
    
      const takeTiles = async (tile, marketId, row) => {
        socket.emit("TakeTiles", { tile, marketId, row });
      };
    
      const getGame = async (roomId) => {
        socket.emit("GetGame", { roomId });
      };
    
      return { setupGame, takeTiles, getGame };
}

export default useGame;