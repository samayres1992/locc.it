import axios from 'axios';
import { stringify } from 'flatted/esm';
import randomString from 'shortid';
import Async from 'async';
import {
  ENCRYPT,
  PASSCODE,
} from './types';

export const encrypt = ( data ) => async dispatch => {
  const { userId, title, expiry, encryptedData } = data;

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
      }).then(( res ) => {
        dispatch({ type: ENCRYPT, payload: res.data });
      });
    },
    ( err, res ) => {
      console.log('encrypt res', res);
      if ( err ) {
        // console.log('Error', err);
        return res.status(400).send({
          message: 'Failure to create url: Something went wrong, please contact us.'
        });
      }
    }
  );
}

export const generatedPasscode =  ( data ) => async dispatch => {
  dispatch({ type: PASSCODE, payload: data });
}