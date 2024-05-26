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
import { Collapse, Ripple, initTWE } from "tw-elements";

initTWE({ Collapse, Ripple });

const Session = () => {
  const { authUser } = useAuthContext();
  const { roomId } = useParams();
  const { rooms, setRooms } = useRoomContext();
  const { leaveRoom, getRooms, loading } = useJoinRoom();
  const { gameState, setGameState } = useGameContext();
  const { setupGame, startGame, getGame, takeTiles } = useGame();
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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  //const [room, setRoom] = useState();

  //setRoom(rooms.find(room => room._id === roomId) || null);
  let room = rooms.find((room) => room._id === authUser.roomId) || null;
  console.log("SESSION rooms: ", rooms);
  console.log("SESSION room: ", room);

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
    console.log("SETUP");
    console.log("SETUP authUser: ", authUser);
    if (room && room.users[0]._id === authUser._id) {
      await setupGame();
      console.log("SETUP UTAN");
    }
    setPlayerReady(false);
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
    console.log("getGame: ", authUser.roomId);
    setIsPanelOpen(false);
  }, []);

  useEffect(() => {
    socket?.on("GameOver", (data) => {
      setGameOver(true);
      console.log("Game Over: ");
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
    <div className="h-full flex flex-col">
      <a
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="lg:hidden text-center block rounded bg-primary px-6 pb-2 pt-2.5 
          text-xs font-medium uppercase leading-normal text-white shadow-primary-3 
          transition duration-150 ease-in-out hover:bg-primary-accent-300 
          hover:shadow-primary-2 focus:bg-primary-accent-300 
          focus:shadow-primary-2 focus:outline-none focus:ring-0 
          active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 
          dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong 
          dark:active:shadow-dark-strong"
        style={{ cursor: "pointer" }}
      >
        {isPanelOpen ? "Back to Game" : "Menu"}
      </a>
      {/* Main content area */}
      <div className="lg:flex lg:flex-row h-full overflow-auto no-scrollbar">
        {/* Left side panel */}
        <div
          className={`w-full lg:w-1/3 lg:h-full lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:z-10 p-4 space-y-2
            ${
              isPanelOpen ? "slide-in block" : "slide-out hidden"
            } lg:!translate-x-0 lg:!opacity-100 lg:block lg:!slide-in`}
        >
          {/* Buttons Div */}
          <div className="flex flex-grow justify-between">
            <button
              onClick={handleLeaveRoom}
              className="inline-flex flex-1 mr-0.5 justify-center items-center bg-base-300 text-base-content py-2 px-4 rounded-md"
            >
              <FiLogOut className="mr-1" /> Leave Room
            </button>
            {!gameState && !gameOver && (
              <button
                onClick={handleToggleReady}
                className={`inline-flex flex-1 items-center justify-center py-2 px-4 rounded-md ${
                  playerReady
                    ? "bg-success text-success-content"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {playerReady ? "Ready" : "Not Ready"}
              </button>
            )}
          </div>
          <div className="flex-grow h-full">
            <Chatbox />
          </div>
        </div>
        {/* Right side content */}
        <div
          className={`w-full lg:w-2/3 lg:ml-auto lg:relative flex flex-col overflow-auto items-center justify-center transition-opacity duration-300 ease-in-out ${
            !isPanelOpen ? "flex" : "hidden"
          } lg:!flex`}
        >
          {/* Status Board */}
          {!gameState && !gameOver && room && room.users.length > 0 && (
            <div className="flex-grow flex justify-center items-center">
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
          {/* Game Board */}
          {gameState && !gameOver && (
            <div className="flex flex-wrap justify-around text-center w-full overflow-y-auto no-scrollbar items-center">
              {/* Conditionally render first row */}
              {gameState.playerBoards[2] && (
                <div className="m-5 inline-block">
                  <PlayerBoardCard
                    playerBoard={gameState.playerBoards[2]}
                    onCollectedTilesClick={handleRowClick}
                  />
                </div>
              )}
              {gameState.playerBoards[3] && (
                <div className="m-5 inline-block">
                  <PlayerBoardCard
                    playerBoard={gameState.playerBoards[3]}
                    onCollectedTilesClick={handleRowClick}
                  />
                </div>
              )}
              {/* Second row */}
              <div className="block">
                <div className="flex flex-wrap justify-around text-center w-full">
                  <div className="flex flex-wrap pt-5 justify-around text-center w-full">
                    {gameState.markets.map((market, index) => (
                      <div className="inline-block m-1" key={index}>
                        <Market
                          marketId={index}
                          tiles={market}
                          onTileClick={handleTileClick}
                          selectedTile={selectedTile}
                          selectedMarket={selectedMarket}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="block m-1">
                    <SharedMarket
                      tiles={gameState.sharedMarket}
                      onTileClick={(tile) => handleTileClick(tile, -1)}
                      selectedTile={selectedTile}
                      selectedMarket={selectedMarket}
                    />
                  </div>
                </div>
              </div>
              {/* Conditionally render third row */}
              {gameState.playerBoards[1] && (
                <div className="m-5 inline-block">
                  <PlayerBoardCard
                    playerBoard={gameState.playerBoards[1]}
                    onCollectedTilesClick={handleRowClick}
                  />
                </div>
              )}
              {gameState.playerBoards[0] && (
                <div className="m-5 inline-block">
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
    </div>
  );
};

export default Session;
