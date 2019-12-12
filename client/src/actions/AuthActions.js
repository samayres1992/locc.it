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
  await axios({
    method: 'post',
    url: '/auth/local/login',
    data: {
      email: email,
      password: password
    }
  }).then(res => {
    console.log('res', res);
    if (res.data.error) {
      return dispatch({ type: LOGIN_USER, payload: { error: res.error }});
    }
    const { _id, activated } = res.data;
    dispatch({ type: LOGIN_USER, payload: { _id, activated }});
  });
}

export const registerUser = ( data ) => async dispatch => {
  const { email, password } = data;
  await axios({
    method: 'post',
    url: '/auth/local/register',
    data: {
      email: email,
      password: password
    }
  }).then(res => {
    if (res.data.error) {
      return dispatch({ type: REGISTER_USER, payload: { error: res.data.error }});
    }
    const { _id, activated } = res.data;
    dispatch({ type: REGISTER_USER, payload: { _id, activated }});
  });
}
