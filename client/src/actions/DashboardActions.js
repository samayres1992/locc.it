import axios from 'axios';
import {
  FETCH_LOCKS,
  SET_ERRORS
} from './types';

export const fetchLocks = (data) => async dispatch => {
  try {
    const res = await axios.get('/api/fetch_locks');
    dispatch({ type: FETCH_LOCKS, payload: res.data });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { dashboard: "Unable to fetch user's encrypted credentials." }});
  }
};