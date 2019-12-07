import axios from 'axios';
import { 
  FETCH_USER,
} from './types';

export const handleStripeToken = ( data ) => async dispatch => {
  const res = await axios.post('/api/stripe', data);
  dispatch({ type: FETCH_USER, payload: res.data });
}