import { CREATE_ANOTHER, ENCRYPT, PASSCODE } from '../actions/types'; 

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
        passcode: action.payload.passcode
      }
    case CREATE_ANOTHER:
      return action.payload
    default:
      return state;
  }
}