import { combineReducers } from 'redux';
import authReducer from './authReducer';
import encryptReducer from './encryptReducer';

export default combineReducers({
  auth: authReducer,
  key: encryptReducer
});
