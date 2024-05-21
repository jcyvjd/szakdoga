import React from 'react';

import Tile from './Tile';

const SharedMarket = ({ tiles, onTileClick, selectedTile, selectedMarket }) => (
  <div id='-1' className="flex flex-col items-center p-4 rounded-md">
    <h2>Shared Market</h2>
    <div className="flex flex-wrap justify-center">
      {tiles.map((tile, index) => (
        <Tile 
          key={index}
          tile={tile}
          onClick={() => onTileClick(tile)}
          isSelected = {selectedTile === tile && selectedMarket === -1}
          id={`market-${-1}-tile-${index}`}
        />
      ))}
    </div>
  </div>
);

export default SharedMarket;