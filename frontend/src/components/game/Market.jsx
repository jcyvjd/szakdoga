import React from 'react';
import Tile from './Tile';

import factory_img from '../../assets/factory1.jpg';

const Market = ({ tiles, onTileClick, marketId, selectedTile, selectedMarket }) => (
  <div className="flex flex-col items-center p-4 rounded-md border-2 border-gray-300 relative" style={{
    borderRadius: '15px',
    border: '2px solid black',
    overflow: 'hidden',
  }}>
    <div className="absolute inset-0" style={{
      backgroundImage: `url(${factory_img})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'saturate(70%)',
      zIndex: -1,
    }}></div>
    
    <div className="grid grid-cols-2 gap-1 w-full h-full">
      {tiles.map((tile, index) => (
        <Tile 
          key={index}
          tile={tile}
          onClick={() => onTileClick(tile, marketId)}
          isSelected = {selectedTile === tile && selectedMarket === marketId}
        />
      ))}
    </div>
  </div>
);

export default Market;