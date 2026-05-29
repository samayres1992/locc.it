import { CHECK_URL, DECRYPT_DATA, PASSCODE_DECRYPTED, FETCH_SECRET } from '../actions/types';

export default function (state = null, action) {
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
      return {
        ...state,
        lockId: action.payload.lockId,
        attempts: action.payload.attempts,
        locked: action.payload.locked,
        decryptedData: action.payload.decryptedData,
      };
    default:
      return state;
  }
}
