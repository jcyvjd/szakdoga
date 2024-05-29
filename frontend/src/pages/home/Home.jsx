import React, { useEffect } from "react";
import { useRoomContext } from "../../context/RoomContext";
import { useAuthContext } from "../../context/AuthContext";
import useListenRooms from "../../hooks/useListenRooms";

import RoomForm from "./RoomForm";
import useLogout from "../../hooks/useLogout";
import HomeSideBar from "./HomeSideBar";

const Home = () => {
  const { rooms, setRooms } = useRoomContext();
  const { authUser } = useAuthContext();
  const { logout } = useLogout();

  useListenRooms();

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.error) {
        if (data.error === "Session expired - Token Expired" || data.error === "User not found") {
          logout();
          history.pushState("/login", "");
        }
      }
      setRooms(data);
    } catch (error) {

    }
  };

  useEffect(() => {
    if (authUser) {
      fetchRooms();
    }
  }, [authUser]);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/2 pb-10 md:pb-0 md:h-full">
        <RoomForm />
      </div>
      <div className="w-full md:w-1/2 flex-grow md:h-full overflow-auto">
        <HomeSideBar rooms={rooms} />
      </div>
    </div>
  );
};

export default Home;
