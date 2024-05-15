import { createContext, useState, useContext } from "react";

export const RoomContext = createContext()

export const useRoomContext = () => {
    return useContext(RoomContext)
}

export const RoomContextProvider = ({children}) => {
    const [rooms, setRooms] = useState([]);

    return <RoomContext.Provider value={{rooms, setRooms}}>
            {children}
        </RoomContext.Provider>
}