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
        if (data.error === "Session expired - Token Expired") {
          logout();
          history.pushState("/login", "");
        }
      }
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchRooms();
    }
  }, [authUser]);

  return (

<<<<<<< Updated upstream
    <div className="md:flex h-full">
      <div className="w-full md:w-1/2 pt-10">
        <RoomForm />
      </div>
      <div className="w-full md:w-1/2 pt-10 ">
=======
    <div className="md:flex">
      <div className="w-full md:h-screen md:w-1/2">
        <RoomForm />
      </div>
      <div className="md:w-1/2 pt-10">
>>>>>>> Stashed changes
        <HomeSideBar rooms={rooms} />
      </div>
    </div>
    
  );
};

export default Home;
