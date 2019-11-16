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

export const encrypt = (dataToEncrypt) => async dispatch => {
  const res = await axios.post('/api/encrypt', dataToEncrypt);
  dispatch({ type: ENCRYPT, payload: res.data });
}