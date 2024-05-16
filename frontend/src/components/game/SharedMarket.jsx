import React from 'react';

import Tile from './Tile';

const SharedMarket = ({ tiles, onTileClick, selectedTile, selectedMarket }) => (
  <div className="flex flex-col items-center p-4 rounded-md">
    <h2>Shared Market</h2>
    <div className="flex flex-wrap justify-center">
      {tiles.map((tile, index) => (
        <Tile 
          key={index}
          tile={tile}
          onClick={() => onTileClick(tile)}
          isSelected = {selectedTile === tile && selectedMarket === -1}
        />
      ))}
    </div>
  </div>
);

export default SharedMarket;