import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTokenExpiry, selectToken } from "./redux/apiResponse/loginApiSlice";
import { setShowNavbar } from "./redux/apiResponse/navBarSlice";
import { isTokenValid } from './utils';

export const PrivateRoute = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const expireTime = useSelector(getTokenExpiry);
    const token = useSelector(selectToken);

    if (isTokenValid(expireTime, token)) {
        return children;
    } else {
        dispatch(setShowNavbar(false));

        // Store the attempted URL before redirecting to login
        sessionStorage.setItem("redirectAfterLogin", location.pathname + location.search);

        return <Navigate to="/login" replace />;
    }
};
