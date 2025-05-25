import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// eslint-disable-next-line react/prop-types
const PublicRoute = ({ children }) => {
    const {  loggedIn } = useSelector((state) => state.user);
    if (!loggedIn) {
        return children;
    }
    return <Navigate to="/dashboard" />;
};

export default PublicRoute;

