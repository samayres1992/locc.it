import { CHECK_URL, DECRYPT_DATA, DECRYPT_FAILED, PASSCODE_DECRYPTED, FETCH_SECRET } from '../actions/types';

export default function decryptReducer(state = null, action) {
  switch (action.type) {
    case CHECK_URL:
      // Legacy server-side flow.
      return {
        ...state,
        lockId: action.payload.lockId || false,
        locked: action.payload.locked || false,
      };
    case FETCH_SECRET:
      // New client-side flow. Store the ciphertext + URL + title so the
      // DecryptForm can run the AES decrypt locally on passcode submission.
      return {
        ...state,
        url: action.payload.url,
        ciphertext: action.payload.ciphertext,
        title: action.payload.title,
        expiry: action.payload.expiry,
      };
    case PASSCODE_DECRYPTED:
      return {
        ...state,
        decryptedData: action.payload || false,
      };
    case DECRYPT_DATA:
      // Carries the plaintext for both the new (client-side) and legacy
      // (server-side) flows. Legacy payload also carries attempts/locked
      // for the lockout UI; new payload only carries decryptedData.
      {
      const decryptedData = action.payload.decryptedData || {};
      return {
        ...state,
        lockId: action.payload.lockId,
        attempts: action.payload.attempts,
        locked: action.payload.locked,
        decryptedData: {
          ...decryptedData,
          title: decryptedData.title || (state && state.title) || '',
        },
      };
      }
    case DECRYPT_FAILED: {
      const attempts = ((state && state.attempts) || 0) + 1;
      const MAX_ATTEMPTS = 3;
      // Lock for 15 minutes after the third failure.
      const locked = attempts >= MAX_ATTEMPTS
        ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
        : (state && state.locked) || false;
      return {
        ...state,
        attempts,
        locked,
      };
    }
    default:
      return state;
  }
}
