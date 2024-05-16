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
    <div className="">
      <div className="">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-1/2 p-2 border placeholder-neutral-content bg-primary border-primary-content text-primary-content rounded-md"
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
      <div className="flex flex-col gap-4 mt-4 pt-4 overflow-auto no-scrollbar" style={{ maxHeight: '80vh' }} >
        {filteredRooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default HomeSideBar;