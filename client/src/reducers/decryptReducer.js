import { CHECK_URL, DECRYPT_DATA, PASSCODE_DECRYPTED } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case CHECK_URL:
      console.log("action.type", action.payload);
      return {
        ...state,
        lockId: action.payload.lockId || false,
        locked: action.payload.locked || false,
      };
    case PASSCODE_DECRYPTED:
      return {
        ...state,
        decryptedData: action.payload || false,
      };
    case DECRYPT_DATA:
      return {
        ...state,
        lockId: action.payload.lockId,
        attempts: action.payload.attempts,
        locked: action.payload.locked,
        decryptedData: action.payload.decryptedData
      }
    default:
      return state;
  }
}