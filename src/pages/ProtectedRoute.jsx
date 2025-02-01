
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ children }) => {

    const {data,loggedIn} = useSelector((state)=>state.user);

    console.log("Entering ProtectedRoute",loggedIn);

    if(loggedIn){

        return children;

    }
    return <Navigate to="/login"></Navigate>
};

export default ProtectedRoute;

