import React from "react";
import useLogout from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import logo from "../assets/azul_logo2.png";

const Navbar = () => {
  const { loading, logout } = useLogout();
  const { authUser } = useAuthContext();

  return (
    <>
      <nav className="bg-base-200 text-base-content flex justify-between  w-full">
        {<img src={logo} alt="Azul_Logo" className="relative -left-10 h-20" />}
        {authUser && (
          <div className="flex items-center">
            <span className="mr-10 text-lg font-bold">{authUser.username}</span>
            <FiLogOut
              className="mr-10 cursor-pointer"
              size={24}
              onClick={logout}
            />
          </div>
        )}
        {/*!authUser && (
          <div>
            <Link to="/login">Login</Link> / 
            <Link to="/signup">Signup</Link>
          </div>
        )*/}
      </nav>
    </>
  );
};

export default Navbar;