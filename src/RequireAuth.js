import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../src/hooks/useAuth";

const RequireAuth = () => {
    const location = useLocation();
    return (
        JSON.parse(localStorage.getItem("userData"))
            ? <Outlet/>
            : <Navigate to='/login' state={{from: location}} replace/>

    );
}

export default RequireAuth;