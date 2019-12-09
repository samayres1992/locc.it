import { combineReducers } from 'redux';
import authReducer from './authReducer';
import encryptReducer from './encryptReducer';
import decryptReducer from './decryptReducer';
import dashboardReducer from './dashboardReducer';

export default combineReducers({
  auth: authReducer,
  encryptForm: encryptReducer,
  decryptForm: decryptReducer,
  dashboard: dashboardReducer
});