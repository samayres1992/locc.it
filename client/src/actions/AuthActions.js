import axios from 'axios';
import { 
  FETCH_USER,
  LOGIN_USER,
  REGISTER_USER,
  RESET_USER,
  SET_ERRORS
} from './types';

export const fetchUser = () => async dispatch => {
  var userErrors = {};
  try {
    const res = await axios.get('/auth/current_user');
    if (res.data.errors) {
      dispatch({ type: SET_ERRORS, payload: res.data.errors });
    } 
    else if (res.data) {
      const { _id, activated } = res.data;
      dispatch({ type: FETCH_USER, payload: { _id, activated  } });
    }
    else {
      dispatch({ type: FETCH_USER, payload: false });
    }
  }
  catch (errors) { 
    userErrors.user = "Unable to fetch user data";
    dispatch({ type: SET_ERRORS, payload: { errors: userErrors }});
  }
};

export const loginUser = ({ email, password }) => async dispatch => {
  var loginErrors = {};
  try {
    await axios({
      method: 'post',
      url: '/auth/local/login',
      data: {
        email: email,
        password: password
      }
    }).then(res => {
      if (res.data.errors) {
        return dispatch({ type: SET_ERRORS, payload: res.data.errors });
      }
      const { _id, activated } = res.data;
      dispatch({ type: LOGIN_USER, payload: { _id, activated }});
    });
  }
  catch(errors) {
    loginErrors.password = "Invalid email or password.";
    dispatch({ type: SET_ERRORS, payload: loginErrors });
  }
}

export const registerUser = ({ email, password }) => async dispatch => {
  var registerErrors = {};
  try {
    await axios({
      method: 'post',
      url: '/auth/local/register',
      data: {
        email: email,
        password: password
      }
    }).then(res => {
      if (res.data.errors) {
        return dispatch({ type: SET_ERRORS, payload: res.data.errors });
      }
      const { _id, activated } = res.data;
      dispatch({ type: REGISTER_USER, payload: { _id, activated }});
    });
  }
  catch(errors) {
    registerErrors.email = "Account already exists with this email.";
    dispatch({ type: SET_ERRORS, payload: registerErrors });
  }
}

export const anonResetNewPassword = ({ token, password }) => async dispatch => {
  var resetErrors = {};
  try {
    await axios({
      method: 'post',
      url: '/auth/local/reset',
      data: {
        token: token,
        password: password
      }
    }).then(res => {
      if (res.data.errors) {
        return dispatch({ type: SET_ERRORS, payload: res.data.errors });
      }
      const { _id, activated } = res.data;
      dispatch({ type: RESET_USER, payload: { _id, activated }});
    });
  }
  catch (errors) {
    resetErrors.password = "New password could not be set.";
    dispatch({ type: SET_ERRORS, payload: resetErrors });
  }
}
