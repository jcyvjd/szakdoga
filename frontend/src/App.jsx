import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import {Toaster} from "react-hot-toast"

import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Home from './pages/home/Home'
import Session from './pages/session/Session'
import Navbar from "./components/Navbar"
import { useAuthContext } from './context/AuthContext'


function App() {
  const {authUser} = useAuthContext()

  return (
    <>
      <Navbar/>
      <div className='p-4 pt-16 h-screen overflow-hidden'>
        <Routes>
          
              <Route path="/" element={(authUser && authUser.roomId) ?<Navigate to={`/session/:roomId`} /> :
              (authUser ? <Home/>: <Navigate to="/login" />)
              } />
              <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
              <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
            
          <Route path={`/session/:roomId`} element={authUser ?<Session /> : <Navigate to="/"/>} />
        </Routes>
        <Toaster/>
      </div>
    </>
      
  )
}

export default App




{/* <Route path="/" element={authUser ? <Home/>: <Navigate to="/login" /> }/>
          <Route path="/login" element={ authUser ? <Navigate to="/" /> :<Login/>}  />
          <Route path="/signup" element={ authUser ? <Navigate to="/" /> : <Signup/>}  />
          <Route path={`/session/${authUser.roomId}`} element={<Session/>}  /> */}
          
    