import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { useAuthContext } from '../../context/AuthContext';
import tile_red from '../../assets/tiles/tile_red.png';
import tile_blue from '../../assets/tiles/tile_blue.png';
import tile_azure from '../../assets/tiles/tile_azure.png';
import tile_black from '../../assets/tiles/tile_black.png';
import tile_yellow from '../../assets/tiles/tile_yellow.png';
import tile_white from '../../assets/tiles/tile_white.png';

const tileImages = {
  red: tile_red,
  blue: tile_blue,
  azure: tile_azure,
  black: tile_black,
  yellow: tile_yellow,
  white: tile_white,
};

const PlayerBoardCard = ({ playerBoard, onCollectedTilesClick }) => {
  const { playerId, points, collectedTiles, wallTiles, floorTiles, _id } = playerBoard;
  const name = playerId.username;
  const { gameState } = useGameContext();
  const { authUser } = useAuthContext();

  const tileColors = {
    empty: '#ccc',
    red: 'red',
    blue: 'blue',
    azure: 'skyblue',
    black: 'black',
    yellow: 'yellow',
    white: 'white',
  };

  const emptyWallTilePattern = [
    ['blue', 'yellow', 'red', 'black', 'azure'],
    ['azure', 'blue', 'yellow', 'red', 'black'],
    ['black', 'azure', 'blue', 'yellow', 'red'],
    ['red', 'black', 'azure', 'blue', 'yellow'],
    ['yellow', 'red', 'black', 'azure', 'blue'],
  ];

  const colorWithOpacity = {
    blue: 'rgba(0, 0, 255, 0.4)',
    yellow: 'rgba(255, 255, 0, 0.4)',
    red: 'rgba(255, 0, 0, 0.4)',
    black: 'rgba(0, 0, 0, 0.4)',
    azure: 'rgba(135, 206, 235, 0.4)',
  };

  const isPlayerTurn = gameState && gameState.playerToMove.toString() === playerBoard.playerId._id.toString();
  const isAuthUser = authUser._id.toString() === playerBoard.playerId._id.toString();

  let borderColor = '';
  if (isAuthUser) {
    borderColor = isPlayerTurn ? 'border-green-500' : '';
  } else {
    borderColor = isPlayerTurn ? 'border-red-500' : '';
  }

  return (
    <div id={_id} className={`bg-white rounded-lg shadow-md p-4 w-80 flex flex-col ${borderColor} border-2`}>
      {/* Top section: Points and Player ID */}
      <div className="flex justify-between mb-2">
        <div>
          <span className="font-semibold">Points:</span> {points}
        </div>
        <div className='text-right'>
          <span className="font-semibold">Player:</span> {name}
        </div>
      </div>

      {/* Middle section: Collected Tiles and Wall Tiles */}
      <div className="flex flex-row items-center justify-center space-x-4 mb-4">
        {/* Collected Tiles */}
        <div className="flex flex-col items-center">
          <span className="font-semibold">Collected Tiles</span>
          <div className="flex flex-col">
            {collectedTiles.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-1 justify-end">
                {row.map((tile, colIndex) => (
                  <div 
                    id={`playerBoard-${_id}-col-${rowIndex}-tile-${colIndex}`} // Unique ID for each tile
                    key={colIndex} 
                    className={`w-6 h-6 rounded-md cursor-pointer`} 
                    style={{
                      border: '1px solid #ddd',
                      backgroundImage: tile === 'empty' ? 'none' : `url(${tileImages[tile]})`,
                      backgroundSize: 'cover',
                      backgroundColor: tileColors[tile] || '#ccc',
                      cursor: 'pointer',
                    }}
                    onClick={() => onCollectedTilesClick(rowIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Wall Tiles */}
        <div className="flex flex-col items-center">
          <span className="font-semibold">Wall Tiles</span>
          <div className="flex flex-col">
            {wallTiles.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-1">
                {row.map((tile, colIndex) => (
                  <div 
                    id={`playerBoard-${_id}-wall-${rowIndex}-tile-${colIndex}`} // Unique ID for each tile
                    key={colIndex} 
                    className={`w-6 h-6 rounded-md`} 
                    style={{
                      border: '1px solid #ddd',
                      backgroundImage: tile === 'empty' ? 'none' : `url(${tileImages[tile]})`,
                      backgroundSize: 'cover',
                      backgroundColor: tile === 'empty' ? colorWithOpacity[emptyWallTilePattern[rowIndex][colIndex]] : tileColors[tile] || '#ccc',
                      //cursor: 'pointer',
                    }} 
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section: Floor Tiles */}
      <div className="flex flex-col items-center">
        <span className="font-semibold">Floor Tiles</span>
        <div className="flex space-x-1">
          {floorTiles.map((tile, index) => (
            <div
              id={`playerBoard-${_id}-floor-tile-${index}`} // Unique ID for each tile
              key={index}
              className="w-6 h-6 rounded-md"
              style={{
                border: '1px solid #ddd',
                backgroundImage: tile === 'empty' ? 'none' : `url(${tileImages[tile]})`,
                backgroundSize: 'cover',
                backgroundColor: tileColors[tile] || '#ccc',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerBoardCard;
