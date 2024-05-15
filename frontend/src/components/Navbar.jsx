import React from 'react'
import useLogout from '../hooks/useLogout'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { FiLogOut } from 'react-icons/fi';
import logo from '../assets/azul_logo2.png'

const Navbar = () => {

    const {loading, logout} = useLogout()
    const { authUser } = useAuthContext()

  return (
    <header className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center fixed top-0 w-full z-10">
        <Link to="/">
          <h1 className="text-xl font-semibold">Welcom to Azul</h1> 
          {/* <img src={logo} alt="Azul_Logo" className="h-8" /> */}
        </Link>
        <nav>
            {authUser && (
                 <div className="flex items-center">
                 <span className="mr-4">{authUser.username}</span>
                 <FiLogOut className="text-white cursor-pointer" size={24} onClick={logout} />
                </div> 
            )}
            {/*!authUser && (
                <div>
                    <Link to="/login">Login</Link> / 
                    <Link to="/signup">Signup</Link>
              </div>
            )*/}
        </nav>

    </header>
  )
}

export default Navbar
