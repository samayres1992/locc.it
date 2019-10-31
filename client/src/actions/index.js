import axios from 'axios';
import { FETCH_USER, ENCRYPT } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleStripeToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
}

export const codeGen = (code) => async dispatch => {
  const code = 'test';
  dispatch({ type: ENCRYPT, payload: code });
}