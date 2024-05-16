import { useParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useRoomContext } from "../../context/RoomContext";
import { useGameContext } from "../../context/GameContext";
import { useSocketContext } from "../../context/SocketContext";
import useJoinRoom from "../../hooks/useJoinRoom";
import Chatbox from "../../components/messages/Chatbox";
import { FiLogOut } from "react-icons/fi";
import useGame from "../../hooks/useGame";
import useListenGame from "../../hooks/useListenGame";
import PlayerBoardCard from "../../components/game/PlayerBoard";
import Market from "../../components/game/Market";
import SharedMarket from "../../components/game/SharedMarket";
import useListenRooms from "../../hooks/useListenRooms";
import { useEffect, useState } from "react";
import StatusBoard from "../../components/game/StatusBoard";
import GameOverPanel from "../../components/game/GameOverPanel";

const Session = () => {
  const { authUser } = useAuthContext();
  const { roomId } = useParams();
  const { rooms, setRooms } = useRoomContext();
  const { leaveRoom, getRooms, loading } = useJoinRoom();
  const { gameState, setGameState } = useGameContext();
  const { setupGame, startGame,getGame, takeTiles } = useGame();
  const { socket, setSocket } = useSocketContext();
  useListenGame();
  useListenRooms();

  console.log("roomID: ", roomId);

  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalPlayedBoards, setFinalPlayedBoards] = useState([]);
  //const [room, setRoom] = useState();

  //setRoom(rooms.find(room => room._id === roomId) || null);
  let  room = (rooms.find(room => room._id === authUser.roomId) || null);
  console.log("SESSION rooms: ",rooms)   
  console.log("SESSION room: ",room)

  const handleLeaveRoom = async () => {
    if (!authUser) {
      return;
    }
    console.log("handleLeaveRoom elott: ", room.users);
    await leaveRoom(room);
    setGameState(null);
    console.log("handleLeaveRoom utan: ", room.users);
  };

  const handleSetupGame = async () => {
    if (!authUser) {
      return;
    }
    console.log("authUser: ", authUser);
    console.log("room: ", room);
    if (room && room.users[0]._id === authUser._id) {
      await setupGame();
    }
  };

  const handleTakeTiles = async (tile, market, row) => {
    console.log(`Taking tiles ${tile} from market ${market} to row ${row}`);
    if (tile !== null && market !== null && row !== null) {
      await takeTiles(tile, market, row);
      setSelectedTile(null);
      setSelectedMarket(null);
      setSelectedRow(null);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    if (selectedTile !== null && selectedMarket !== null) {
      handleTakeTiles(selectedTile, selectedMarket, row);
    }
  };

  const handleTileClick = (tile, marketId) => {
    console.log(`Tile ${tile} clicked in market ${marketId}`);
    setSelectedTile(tile);
    setSelectedMarket(marketId);
    if (selectedRow !== null) {
      handleTakeTiles(tile, marketId, selectedRow);
    }
  };

  const handleToggleReady = async () => {
    const url = `/api/auth/ready/${authUser._id}`;

    let newStatus = playerReady ? "waiting" : "ready";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();
    console.log("handleReady data: ", data);
    if (res.ok) {
      setPlayerReady((prevState) => !prevState);
    } else {
      console.error("Error toggling ready status: ", data.error);
    }
  };

  const canStartGame = () => {
    if (!room) {
      return false;
    }
    if (room && room.users.length < 2) {
      return false;
    }
    const allPlayersReady = room.users.every((user) => user.status === "ready");
    return allPlayersReady;
  };

  useEffect(() => {
    getRooms();
    getGame(authUser.roomId);

  },[]);

  useEffect(() => {
    socket?.on("GameOver", (data) => {
      setGameOver(true);
      setFinalPlayedBoards(data.playerBoards);
      setGameState(null);
    });

    console.log("gameState: ", gameState);

    return () => {
      socket?.off("GameOver");
    };
  }, [socket, gameState, gameOver]);

  useEffect(() => {
    console.log("canStartGame: ", canStartGame());
    if (canStartGame()) {
      handleSetupGame();
    }
  }, [room?.users, playerReady]);

  console.log("game state ", gameState);

  return (
    <div className="flex h-screen">
      {/* Left side panel */}
      <div className="w-full h-screen pb-20 fixed md:w-1/3 flex flex-col pt-15">
        <div className="flex flex-col space-y-4 p-4">
          <button
            onClick={handleLeaveRoom}
            className="flex items-center bg-base-300 text-base-content py-2 px-4 rounded-md"
          >
            <FiLogOut className="mr-1" /> Leave Room
          </button>
          {!gameState && (
            <button
              onClick={handleToggleReady}
              className={`flex items-center py-2 px-4 rounded-md ${
                playerReady
                  ? "bg-success text-success-content"
                  : "bg-base-200 text-base-content"
              }`}
            >
              {playerReady ? "Ready" : "Not Ready"}
            </button>
          )}
          <div className="h-full mt">
            <Chatbox />
          </div>
        </div>
      </div>
      {/* Right side content */}
      <div className="w-2/3 p-4 md:ml-1/3 absolute right-0">
        {/* Status Board */}
        {!gameState && room && room.users.length > 0 && (
          <div className="h-full flex justify-center items-center">
            <StatusBoard
              users={room?.users}
              authUserId={authUser._id}
              onToggleReady={handleToggleReady}
            />
          </div>
        )}
        {/* Game Over Panel */}
        {gameOver && (
          <div className="h-full flex justify-center items-center">
            <GameOverPanel playerBoards={finalPlayedBoards} />
          </div>
        )}
        {/* PGame Board? */}
        {gameState && !gameOver && (
          <div className="grid grid-rows-3 grid-cols-2 gap-2">
            {/* First row */}
            {gameState.playerBoards[2] && (
              <div className="row-start-1 col-start-1">
                <PlayerBoardCard
                  playerBoard={gameState.playerBoards[2]}
                  onCollectedTilesClick={handleRowClick}
                />
              </div>
            )}
            {gameState.playerBoards[3] && (
              <div className="row-start-1 col-start-2">
                <PlayerBoardCard
                  playerBoard={gameState.playerBoards[3]}
                  onCollectedTilesClick={handleRowClick}
                />
              </div>
            )}
            {/* Second row */}
            <div className="row-start-2 col-start-1 col-span-2 flex justify-center items-center">
              <div className="flex flex-wrap justify-around w-full">
                {gameState.markets.map((market, index) => (
                  <div className="m-1">
                    <Market
                      key={index}
                      marketId={index}
                      tiles={market}
                      onTileClick={handleTileClick}
                      selectedTile={selectedTile}
                      selectedMarket={selectedMarket}
                    />
                  </div>
                ))}
                <div className="w-fit">
                  <div className="m-2">
                    <SharedMarket
                      key={-1}
                      tiles={gameState.sharedMarket}
                      onTileClick={(tile) => handleTileClick(tile, -1)}
                      selectedTile={selectedTile}
                      selectedMarket={selectedMarket}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Third row */}
            {gameState.playerBoards[1] && (
              <div className="row-start-3 col-start-1">
                <PlayerBoardCard
                  playerBoard={gameState.playerBoards[1]}
                  onCollectedTilesClick={handleRowClick}
                />
              </div>
            )}
            {gameState.playerBoards[0] && (
              <div className="row-start-3 col-start-2">
                <PlayerBoardCard
                  playerBoard={gameState.playerBoards[0]}
                  onCollectedTilesClick={handleRowClick}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Session;
