import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";


const useRedirect = () => {
    const { authUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser && authUser.roomId) {
            navigate(`/session/${authUser.roomId}`);
        }
        else if (authUser) {
            navigate(`/`);
        }
    }, [authUser]);
}

export default useRedirect;
