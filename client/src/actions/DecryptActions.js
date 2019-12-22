import axios from 'axios';
import {
  CHECK_URL,
  PASSCODE_DECRYPTED,
  DECRYPT_DATA,
  SET_ERRORS
} from './types';

export const checkUrl = (data) => async dispatch => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/check_url',
      data: {
        url: data
      }
    });
    dispatch({ type: CHECK_URL, payload: res.data });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { user: "Unable to verify if credentials exist." }});
  }
}

export const tryUserDecrypt = (lockId, passcode) => async dispatch => {
  try {
    await axios({
      method: 'post',
      url: '/api/decrypt_attempt',
      data: {
        lockId: lockId,
        passcode: passcode
      }
    }).then(res => {
      dispatch({ type: DECRYPT_DATA , payload: res.data });
    });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { decrypt: "Unable to send decrypt request." }});
  }
}

export const passcodeDecrypted = (data) => async dispatch => {
  try {
    dispatch({ type: PASSCODE_DECRYPTED, payload: data });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { decrypt: "Unable to send passcode." }});
  }
}