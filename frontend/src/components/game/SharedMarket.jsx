import React from 'react';

import Tile from './Tile';

const SharedMarket = ({ tiles, onTileClick }) => (
  <div className="flex flex-col items-center bg-gray-200 p-4 rounded-md">
    <h2>Shared Market</h2>
    <div className="flex flex-wrap justify-center">
      {tiles.map((tile, index) => (
        <Tile 
          key={index}
          tile={tile}
          onClick={() => onTileClick(tile)}
        />
      ))}
    </div>
  </div>
);

export default SharedMarket;