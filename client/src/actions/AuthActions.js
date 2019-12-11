import axios from 'axios';
import { 
  FETCH_USER,
  LOGIN_USER,
  REGISTER_USER,
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/auth/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const loginUser = ( data ) => async dispatch => {
  const { email, password } = data;
  const res = await axios({
    method: 'post',
    url: '/auth/local/login',
    data: {
      email: email,
      password: password
    }
  });
  dispatch({ type: LOGIN_USER, payload: res.data});
}

export const registerUser = ( data ) => async dispatch => {
  const { email, password } = data;
  const res = await axios({
    method: 'post',
    url: '/auth/local/register',
    data: {
      email: email,
      password: password
    }
  });
  dispatch({ type: REGISTER_USER , payload: res.data});
}
