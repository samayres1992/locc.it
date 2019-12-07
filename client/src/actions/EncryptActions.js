import axios from 'axios';
import { stringify } from 'flatted/esm';
import {
  ENCRYPT,
  PASSCODE,
} from './types';

export const encrypt = ( data ) => async dispatch => {
  const { userId, title, expiry, encryptedData, url } = data;
  const res = await axios({
    method: 'post',
    url: '/api/encrypt',
    data: {
      userId: userId,
      title: title,
      expiry: expiry,
      encryptedData: stringify(encryptedData),
      url: url
    }
  });
  dispatch({ type: ENCRYPT, payload: res.data });
}

export const generatedPasscode =  ( data ) => async dispatch => {
  dispatch({ type: PASSCODE, payload: data });
}