import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, HashRouter, useLocation } from 'react-router-dom';
import './App.css';
import Map from './pages/Map';
import Alerts from './pages/Alerts';
import Devices from './pages/Devices';
import Insights from './pages/Insights';
import ControlCenter from './pages/ControlCenter'
import Login from './pages/Login';
import Camera from './components/MapContents/MapInsideScreens/Camera';
import ForgetPass from './components/LoginScreens/ForgetPass';
import MyProfile from './components/LoginScreens/MyProfile';
import Settings from './components/LoginScreens/Settings';
import CameraPole from './components/MapContents/MapInsideScreens/Camerapole';
import CameraMapAlert from './components/MapContents/MapInsideScreens/CameraMapAlert'
import ConfirmPass from './components/LoginScreens/ConfrimPass'
import { selectToken } from "./redux/apiResponse/loginApiSlice";
import { useSelector } from 'react-redux';
import { Navbar } from './components';
import { PrivateRoute } from "./PrivateRoute";
import ActiveUser from './components/ActiveUser';
 
const Main = () => {
  const location = useLocation();
  const token = useSelector(selectToken);
 
  const noNavbarRoutes = [
    "/login",
    "/activeUser",
    "/forgot-password",
    "/confirmPassword",
    "/camera",
    "/cameramapalert",
    "/camerapole",
  ];
 
  const shouldDisplayNavbar = !noNavbarRoutes.some(route => location.pathname.startsWith(route));
 
 
  return (
    <>
      {shouldDisplayNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/map' : '/login'} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activeUser" element={<ActiveUser />} />
        <Route path="/forgot-password" element={<ForgetPass />} />
        <Route path="/confirmPassword" element={<ConfirmPass />} />
        <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
        <Route path="/controlcenter" element={<PrivateRoute><ControlCenter /></PrivateRoute>} />
        <Route path="/devices" element={<PrivateRoute><Devices /></PrivateRoute>} />
        <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
        <Route path="/camera/:alertId" element={<PrivateRoute><Camera /></PrivateRoute>} />
        <Route path="/cameramapalert/:alertId" element={<PrivateRoute><CameraMapAlert /></PrivateRoute>} />
        <Route path="/camerapole/:cameraId" element={<PrivateRoute><CameraPole /></PrivateRoute>} />
        <Route path="/myprofile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={"/login"}/>} />
      </Routes>
    </>
  );
};
 
function App() {
  useEffect(() => {
    // Check if the user is already authenticated
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Do something with the token if needed
    }
  }, []);
 
  return (
    <HashRouter>
      <Main />
    </HashRouter>
  );
}
 
export default App;