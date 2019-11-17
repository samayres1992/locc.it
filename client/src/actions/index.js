import axios from 'axios';
import { parse, stringify } from 'flatted/esm';
import { FETCH_USER, ENCRYPT } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleStripeToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
}

export const encrypt = (data) => async dispatch => {
  const res = await axios({
    method: 'post',
    url: '/api/encrypt',
    data: {
      title: stringify(data.title),
      encryptedData: stringify(data.encryptedData)
    }
  });
  dispatch({ type: ENCRYPT, payload: res.data });
}