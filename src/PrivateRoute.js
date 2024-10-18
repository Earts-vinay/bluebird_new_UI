import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getTokenExpiry } from "./redux/apiResponse/loginApiSlice";
import { useSelector, useDispatch } from 'react-redux';
import { isTokenValid } from './utils';
import { selectToken } from "./redux/apiResponse/loginApiSlice";
import { setShowNavbar } from "./redux/apiResponse/navBarSlice";
export const PrivateRoute = ({children}) => {
    const dispatch = useDispatch();
    const expireTime = useSelector(getTokenExpiry);
    const token = useSelector(selectToken);

    if(isTokenValid(expireTime, token)){
        return children;
    }else{
        dispatch(setShowNavbar(false));
        return <Navigate to={'/login'} />
    }
    
}