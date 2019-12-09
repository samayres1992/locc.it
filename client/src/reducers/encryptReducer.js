import { ENCRYPT, PASSCODE } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
  case ENCRYPT:
      return {
        ...state,
        url: action.payload.url,
        expiry: action.payload.expiry
      };
    case PASSCODE:
      return {
        ...state,
        passcode: action.payload.passcode
      };
    default:
      return state;
  }
}