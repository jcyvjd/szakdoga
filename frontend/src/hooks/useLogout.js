import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useRoomContext } from '../context/RoomContext'
import useJoinRoom from './useJoinRoom'
import toast from 'react-hot-toast'

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const {authUser, setAuthUser} =  useAuthContext()

    const logout = async () =>{
        setLoading(true)
        try {
            const res = await fetch("/api/auth/logout",{
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({authUser})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }

            localStorage.removeItem("authUser")
            setAuthUser(null)
        } catch (error) {
            toast.error(error.message)

        }finally{
            setLoading(false)
            localStorage.removeItem("authUser")
            setAuthUser(null)
        }
    }
    return {loading, logout}
}
export default useLogout
