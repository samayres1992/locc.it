import { ENCRYPT } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case ENCRYPT:
      console.log('action.payload', action.payload);
      return {
        ...state,
        title: action.payload.title,
        encryptedData: action.payload,
        key: action.payload
      };
    default:
      return state;
  }
}