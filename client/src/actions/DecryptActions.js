import axios from 'axios';
import { 
  PASSCODE_DECRYPTED,
  DECRYPT_DATA,
  SET_ERRORS
} from './types';

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
      console.log('tryUserDecrypt action', res.data);
      dispatch({ type: DECRYPT_DATA , payload: res.data });
    });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { decrypt: "Unable to send decrypt request." }});
    console.log("error", errors);
  }
}



export const passcodeDecrypted = (data) => async dispatch => {
  try {
    dispatch({ type: PASSCODE_DECRYPTED, payload: data });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { decrypt: "Unable to send passcode." }});
    console.log("error", errors);
  }
}