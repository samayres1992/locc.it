import { ENCRYPT } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case ENCRYPT:
      console.log('encrypt', this.state);
      return {
        ...state,
        encrypt: action.payload
      };
    default:
      return state;
  }
}