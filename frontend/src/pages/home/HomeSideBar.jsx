import React, { useState, useEffect } from 'react';
import { MdClear } from 'react-icons/md';
import RoomCard from './RoomCard';
import useListenRooms from '../../hooks/useListenRooms';

const HomeSideBar = ({ rooms }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  useListenRooms();

  useEffect(() => {
    const filtered = rooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [rooms, searchQuery]);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full h-full flex flex-col"> {/* Add h-full and flex here */}
      <div className="w-full">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border placeholder-neutral-content bg-primary border-primary-content text-primary-content rounded-md"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="right-2 top-1/2 transform -translate-y-1/2"
            >
              <MdClear />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-auto no-scrollbar flex-grow"> {/* Add flex-grow here */}
        {filteredRooms.map((room) => (
          <RoomCard key={room._id} room={room} className="w-full" />
        ))}
      </div>
    </div>
  );
}

export default HomeSideBar;