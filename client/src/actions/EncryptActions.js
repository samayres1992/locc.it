import axios from 'axios';
import { stringify } from 'flatted/esm';
import randomString from 'shortid';
import Async from 'async';
import {
  ENCRYPT,
  PASSCODE,
  CREATE_ANOTHER,
  SET_ERRORS
} from './types';

export const encrypt = (data) => async dispatch => {
  const { userId, title, expiry, encryptedData } = data;
  var encryptErrors = {};
  Async.retry(
    { times: 5, interval: 200 },
    () => { 
      // Generate the URL for the user, if we get a used URL retry.
      let url = randomString.generate();
      axios({
        method: 'post',
        url: '/api/encrypt',
        data: {
          userId: userId,
          title: title,
          expiry: expiry,
          encryptedData: stringify(encryptedData),
          url: url
        }
      }).then((res) => {
        dispatch({ type: ENCRYPT, payload: res.data });
      });
    },
    (errors, res) => {
      if (errors) {
        encryptErrors.encrypt = "Unable to generate, please check all credentials have been added";
        dispatch({ type: SET_ERRORS, payload: encryptErrors });
      }
    }
 );
}

export const createAnother = () => async dispatch => {
  // Reset redux state for encryption 
  dispatch({ type: CREATE_ANOTHER, payload: null });
}

export const generatedPasscode = (data) => async dispatch => {
  dispatch({ type: PASSCODE, payload: data });
}