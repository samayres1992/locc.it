import { combineReducers } from 'redux';
import authReducer from './authReducer';
import encryptReducer from './encryptReducer';
import decryptReducer from './decryptReducer';
import retrieveReducer from './retrieveReducer';

export default combineReducers({
  auth: authReducer,
  encryptForm: encryptReducer,
  decryptForm: decryptReducer,
  retrievedData: retrieveReducer
});