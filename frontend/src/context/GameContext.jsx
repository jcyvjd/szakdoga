import { createContext, useContext, useState } from 'react';
import { useAuthContext } from './AuthContext';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameContextProvider = ({ children }) => {
    const [gameState, setGameState] = useState(null);

    const value = {
        gameState,
        setGameState,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameContext
