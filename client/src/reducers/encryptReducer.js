import { ENCRYPT } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case ENCRYPT:
      console.log('encrypt', action);
      return action.payload || false; 
    default:
      return state;
  }
}