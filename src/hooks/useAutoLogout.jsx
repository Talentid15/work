import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/UserSlice";

const useAutoLogout = () => {
    const dispatch = useDispatch();
    const tokenExpiry = useSelector((state) => state.user.tokenExpiry);

    useEffect(() => {
        if (!tokenExpiry) return;

        const now = Date.now();
        const timeLeft = tokenExpiry - now;

        console.log("time left ",timeLeft);

        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                dispatch(logout());
            }, timeLeft);
            return () => clearTimeout(timer); // Cleanup timer
        } else {
            dispatch(logout()); // If already expired, log out immediately
        }
    }, [tokenExpiry, dispatch]);
};

export default useAutoLogout;
