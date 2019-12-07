import axios from 'axios';
import { 
  CHECK_URL,
  PASSCODE_DECRYPTED,
  DECRYPT_DATA
} from './types';

export const checkUrl = ( data ) => async dispatch => {
  const res = await axios({
    method: 'post',
    url: '/api/check_url',
    data: {
      url: data
    }
  });
  dispatch({ type: CHECK_URL, payload: res.data });
}

export const tryUserDecrypt = ( lockId, passcode ) => async dispatch => {
  const res = await axios({
    method: 'post',
    url: '/api/decrypt_attempt',
    data: {
      lockId: lockId,
      passcode: passcode
    }
  });
  dispatch({ type: DECRYPT_DATA , payload: res.data});
}

export const passcodeDecrypted = ( data ) => async dispatch => {
  dispatch({ type: PASSCODE_DECRYPTED, payload: data });
}