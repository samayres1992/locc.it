import axios from 'axios';
import CryptoJS from 'crypto-js';
import { parse } from 'flatted/esm';
import {
  CHECK_URL,
  PASSCODE_DECRYPTED,
  DECRYPT_DATA,
  FETCH_SECRET,
  SET_ERRORS
} from './types';

// ----------------------------------------------------------------
// NEW — zero-knowledge client-side decrypt flow
// ----------------------------------------------------------------
//
// The passcode never leaves the browser. The client fetches the
// ciphertext from the server (one-shot + 60s grace window),
// runs CryptoJS.AES.decrypt locally, and tells the server to
// delete the record once the recipient has read it.

// Step 1: fetch the encrypted blob. Server marks the record as viewed
// and starts the grace window. Repeated fetches within the window
// return the same ciphertext (tolerates page refresh).
export const fetchSecret = (url) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/secret/${url}`);
    dispatch({ type: FETCH_SECRET, payload: res.data });
  } catch (err) {
    const status = err && err.response && err.response.status;
    if (status === 404 || status === 410) {
      dispatch({
        type: SET_ERRORS,
        payload: { user: 'This link is no longer valid or has already been opened.' }
      });
    } else {
      dispatch({
        type: SET_ERRORS,
        payload: { user: 'Unable to fetch the encrypted payload.' }
      });
    }
  }
};

// Step 2: decrypt the ciphertext in the browser using the recipient's
// passcode. If it works, dispatch the plaintext and call DELETE so the
// server can purge the record immediately. If it fails, report a
// passcode error — the user can try again.
export const tryClientDecrypt = (ciphertext, passcode, url) => async (dispatch) => {
  try {
    const parsedData = parse(ciphertext);
    const bytes = CryptoJS.AES.decrypt(parsedData, String(passcode));
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      throw new Error('Decryption produced no output');
    }
    const decryptedData = JSON.parse(decryptedString);
    dispatch({ type: DECRYPT_DATA, payload: { decryptedData } });
    // Consume the record — best effort. If this fails (network drop, etc.)
    // the cron sweep will catch it within the hour, and the grace window
    // self-cleans on next fetch attempt regardless.
    try {
      await axios.delete(`/api/secret/${url}`);
    } catch (e) {
      // Swallow — the record will be purged by the server's grace-window
      // logic or the cleanup cron. Plaintext is already in the user's view.
    }
  } catch (err) {
    dispatch({
      type: SET_ERRORS,
      payload: { decrypt: 'Incorrect passcode. Please try again.' }
    });
  }
};

// ----------------------------------------------------------------
// LEGACY — server-side decrypt flow
// ----------------------------------------------------------------
//
// Kept so older clients that have cached an old bundle still work
// during the transition window. The new client never calls these.

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
