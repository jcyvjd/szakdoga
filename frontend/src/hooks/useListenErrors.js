import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import toast from "react-hot-toast";
import useLogout from "./useLogout";

const useListenErrors = () => {
    const { socket } = useSocketContext();
    const { logout } = useLogout();

    useEffect(() => {
        socket?.on("Error", (error) => {
            toast.error(error);
        });

        socket?.on("JWTexpired", () => {
            toast.error("Your session has expired. Please log in again.");
            logout();
        });

        return () => {
            socket?.off("error");
        };
    }, [socket]);
}

export default useListenErrors;