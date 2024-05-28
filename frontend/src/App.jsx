import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast"

import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Home from './pages/home/Home'
import Session from './pages/session/Session'
import Navbar from "./components/Navbar"
import { useAuthContext } from './context/AuthContext'
import useListenErrors from './hooks/useListenErrors'
import useRedirect from './hooks/useRedirect'

function App() {
  const { authUser } = useAuthContext();
  useListenErrors();
  useRedirect();

  return (
    <div className='h-screen flex flex-col'>
      <div className='flex-grow h-full overflow-hidden p-4 pb-0'> 
        <Routes>
          <Route path="/" element={(authUser && authUser.roomId) ? <Navigate to={`/session/:roomId`} /> :
            (authUser ? <Home /> : <Navigate to="/login" />)
          } />
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
          <Route path={`/session/:roomId`} element={authUser ? <Session /> : <Navigate to="/" />} />
        </Routes>
        <Toaster />
      </div>
      <div>
        <Navbar/>
      </div>
    </div>
  );
}

export default App;
