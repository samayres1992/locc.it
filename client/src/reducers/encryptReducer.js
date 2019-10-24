import { CODE_GEN } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case CODE_GEN:
      return action.payload || false; 
    default:
      return state;
  }
}