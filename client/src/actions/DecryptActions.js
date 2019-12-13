import axios from 'axios';
import { 
  PASSCODE_DECRYPTED,
  DECRYPT_DATA
} from './types';

export const tryUserDecrypt = ( lockId, passcode ) => async dispatch => {
  await axios({
    method: 'post',
    url: '/api/decrypt_attempt',
    data: {
      lockId: lockId,
      passcode: passcode
    }
  }).then(res => {
    console.log('tryUserDecrypt action', res.data);
    dispatch({ type: DECRYPT_DATA , payload: res.data });
  });
}

export const passcodeDecrypted = ( data ) => async dispatch => {
  dispatch({ type: PASSCODE_DECRYPTED, payload: data });
}