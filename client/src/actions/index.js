import axios from 'axios';
import { stringify } from 'flatted/esm';
import { FETCH_USER, FETCH_LOCKS, DELETE_LOCK, ENCRYPT, PASSCODE, CHECK_URL, PASSCODE_DECRYPTED } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchLocks = () => async dispatch => {
  const res = await axios.get('/api/fetch_locks');
  dispatch({ type: FETCH_LOCKS, payload: res.data });
};

export const handleStripeToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
}

export const encrypt = (data) => async dispatch => {
  const { title, expiry, encryptedData, url } = data;
  console.log('action index', expiry);
  const res = await axios({
    method: 'post',
    url: '/api/encrypt',
    data: {
      title: title,
      expiry: expiry,
      encryptedData: stringify(encryptedData),
      url: url
    }
  });
  dispatch({ type: ENCRYPT, payload: res.data });
}

export const updatePasscode = (passcode) => async dispatch => {
  dispatch({ type: PASSCODE, payload: passcode});
}

export const passcodeDecrypted = (decryptedData) => async dispatch => {
  dispatch({ type: PASSCODE_DECRYPTED, payload: decryptedData});
}

export const checkUrl = (url) => async dispatch => {
  const res = await axios({
    method: 'post',
    url: '/api/check_url',
    data: {
      url: url
    }
  });
  dispatch({ type: CHECK_URL, payload: res.data});
}

export const deleteSelectedLock = (lockId) => async dispatch => {
  console.log("deleteselectlock called");
  const res = await axios({
    method: 'post',
    url: '/api/delete_lock',
    data: {
      lockId: lockId
    }
  });
  dispatch({ type: DELETE_LOCK, payload: res.data});
}