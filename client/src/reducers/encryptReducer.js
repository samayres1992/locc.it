import { ENCRYPT } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case ENCRYPT:
      return {
        ...state,
        encrypt: action.payload
      };
    default:
      return state;
  }
}