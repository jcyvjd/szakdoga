import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import { AuthContextProvider } from './context/AuthContext.jsx'
import { RoomContextProvider } from './context/RoomContext.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { GameContextProvider } from './context/GameContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <RoomContextProvider>
            <ChatContextProvider>
              <GameContextProvider>
                <App />
              </GameContextProvider>
            </ChatContextProvider>
          </RoomContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)




