import React from 'react';
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

const Tile = ({ tile, onClick, isSelected }) => (
  <div 
    style={{
      border: isSelected ? '3px solid #000' : '1px solid #ddd',
      backgroundImage: tile ? `url(${tileImages[tile]})` : 'none',
      backgroundSize: 'cover',
      cursor: 'pointer',
    }}
    className={`w-8 h-8 rounded-md cursor-pointer mx-1 my-1 ${
      tile ? `bg-${tile}` : 'bg-gray-300'
    }`}
    onClick={onClick}
  />
);

export default Tile;