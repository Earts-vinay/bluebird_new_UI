import { configureStore } from '@reduxjs/toolkit';
import loginApiReducer from '../redux/apiResponse/loginApiSlice';
import authReducer from '../redux/apiResponse/authSlice';
import resetPasswordApiReducer from '../redux/apiResponse/passwordResetApiSlice';
import ControlCenterReducer from '../redux/apiResponse/controlCenterSlice';
import AlertReducer from '../redux/apiResponse/alertSlice';
import VecAlertReducer from '../redux/apiResponse/vecalertSlice';
import getPoleReducer from '../redux/apiResponse/poleSlice';
import alertInsideReducer from '../redux/apiResponse/alertInsideSlice';
import getpoleIDReducer from "../redux/apiResponse/getpoleSlice";
import getpropertyReducer from '../redux/apiResponse/propertySlice';
import InsightReducer from '../redux/apiResponse/insightSlice';
import DeviceReducer from '../redux/apiResponse/deviceSlice';
import mapPoleReducer from '../redux/apiResponse/mappoleSlice';
import CameraMapPoleReducer from '../redux/apiResponse/CameramappoleSlice';
import getAlertReducer from "../redux/apiResponse/fetchalertSlice";
import VecAlertTraceReducer from "../redux/apiResponse/VecAlertTrace";
import mapListpoleReducer from "../redux/apiResponse/maplistSlice";
import propertyListViewReducer from "../redux/apiResponse/propertylistviewSlice"
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import UserReducer from '../redux/apiResponse/userSlice';
import poleInBoundaryReducer from "../redux/apiResponse/polesInBoundarySlice";
import  navBarReducer from "../redux/apiResponse/navBarSlice";
import countingReducer from './apiResponse/countingSlice';

const rootReducer = combineReducers({

  loginApi: loginApiReducer,
  auth: authReducer,
  resetPasswordApi:resetPasswordApiReducer,
  getpole:getPoleReducer,
  Mappole:mapPoleReducer,
  ControlCenter:ControlCenterReducer,
  Alert:AlertReducer,
  VecAlert:VecAlertReducer,
  getproperty:getpropertyReducer,
  getpoleId:getpoleIDReducer,
  Insight:InsightReducer,
  Device:DeviceReducer,
  getalert:getAlertReducer,
  User:UserReducer,
  Cameramappole:CameraMapPoleReducer,
  mapListpole: mapListpoleReducer,
  alertInside:alertInsideReducer,
  VecAlertTrace:VecAlertTraceReducer,
  polesInBoundary:poleInBoundaryReducer,
  navBar: navBarReducer,
  propertylistview:propertyListViewReducer,
  counting: countingReducer,
 
});

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['loginApi', 'onboardingcompany', 'dictionary', 'auth',"getproperty", "alertInside", "navBar"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);