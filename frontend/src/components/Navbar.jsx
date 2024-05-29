import React, { useState } from "react";
import useLogout from "../hooks/useLogout";
import { useAuthContext } from "../context/AuthContext";
import { FiLogOut, FiHelpCircle } from "react-icons/fi";
import logo from "/vite.svg";
import HelpPanel from "./HelpPanel";

const Navbar = () => {
  const { loading, logout } = useLogout();
  const { authUser } = useAuthContext();
  const [showHelpPanel, setShowHelpPanel] = useState(false);

  return (
    <>
      <nav className="bg-base-200 text-base-content flex justify-between  w-full z-100">
        <div className="flex items-center">
          <img src={logo} alt="Vite_Logo" className="relative left-4 h-10 my-2" />
          <button type="button" className="ml-8 mr-4" onClick={() => setShowHelpPanel(true)}>
            <FiHelpCircle size={24} />
          </button>
        </div>
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
      </nav>
      <HelpPanel isOpen={showHelpPanel} setShowHelpPanel={setShowHelpPanel} />
    </>
  );
};

export default Navbar;