import React from 'react';
import Tile from './Tile';

const Market = ({ tiles, onTileClick, marketId }) => (
  <div className="flex flex-col items-center bg-gray-200 p-4 rounded-md" >
    <h2 className="mb-2">Market {marketId}</h2>
    <div className="grid grid-cols-2 gap-1 w-full h-full">
      {tiles.map((tile, index) => (
        <Tile 
          key={index}
          tile={tile}
          onClick={() => onTileClick(tile, marketId)}
        />
      ))}
    </div>
  </div>
);

export default Market;