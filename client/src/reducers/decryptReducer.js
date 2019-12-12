import { CHECK_URL, DECRYPT_DATA, PASSCODE_DECRYPTED } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case CHECK_URL:
      return action.payload || false;
    case PASSCODE_DECRYPTED:
      return {
        ...state,
        decryptedData: action.payload || false,
      };
    case DECRYPT_DATA:
      return action.payload || false
    default:
      return state;
  }
}