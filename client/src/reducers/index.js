import { combineReducers } from 'redux';
import authReducer from './authReducer';
import encryptReducer from './encryptReducer';
import decryptReducer from './decryptReducer';
import dashboardReducer from './dashboardReducer';
import errorsReducer from './errorsReducer';

export default combineReducers({
  auth: authReducer,
  encryptForm: encryptReducer,
  decryptForm: decryptReducer,
  dashboard: dashboardReducer,
  errors: errorsReducer
});