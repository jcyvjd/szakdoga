import React, { useState, useEffect } from 'react';
import { MdClear } from 'react-icons/md';
import RoomCard from './RoomCard';
import useListenRooms from '../../hooks/useListenRooms';
import { motion, AnimatePresence } from 'framer-motion';

const HomeSideBar = ({ rooms }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [prevRooms, setPrevRooms] = useState([]);
  useListenRooms();

  useEffect(() => {
    const filtered = rooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [rooms, searchQuery]);

  useEffect(() => {
    setPrevRooms(filteredRooms);
  }, [filteredRooms]);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const isRoomNew = roomId => !prevRooms.some(room => room._id === roomId);
  const isRoomDeleted = roomId => !filteredRooms.some(room => room._id === roomId);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full">
        <div className="mb-4">
        <div className="relative w-full md:w-1/2">
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <MdClear />
            </button>
          )}
        </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-auto no-scrollbar flex-grow">
        <AnimatePresence>
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room._id}
              initial={isRoomNew(room._id) ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isRoomDeleted(room._id) ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RoomCard room={room} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {prevRooms.map((room, index) => (
            !filteredRooms.some(filteredRoom => filteredRoom._id === room._id) && (
              <motion.div
                key={room._id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <RoomCard room={room} className="w-full" />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomeSideBar;
