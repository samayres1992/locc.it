import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import encryptReducer from './encryptReducer';

export default combineReducers({
  auth: authReducer,
  form: reduxForm,
  encrypt: encryptReducer
});
