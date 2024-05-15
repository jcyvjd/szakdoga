import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("authUser")) || null)

    useEffect(() => {
        localStorage.setItem("authUser", JSON.stringify(authUser));
    }, [authUser]);

    return <AuthContext.Provider value={{authUser, setAuthUser}}>
            {children}
        </AuthContext.Provider>
}