import axios from 'axios';
import { 
  PASSCODE_DECRYPTED,
  DECRYPT_DATA
} from './types';

export const tryUserDecrypt = ( lockId, passcode ) => async dispatch => {
  const res = await axios({
    method: 'post',
    url: '/api/decrypt_attempt',
    data: {
      lockId: lockId,
      passcode: passcode
    }
  }).then(res => {
    const { lockId, attempts, locked } = res.data;
    console.log('tryUserDecrypt', res.data);
    dispatch({ type: DECRYPT_DATA , payload: { lockId, attempts, locked }});
  });
}

export const passcodeDecrypted = ( data ) => async dispatch => {
  dispatch({ type: PASSCODE_DECRYPTED, payload: data });
}