import { CHECK_URL, FETCH_LOCKS, UPDATE_LOCK } from '../actions/types'; 

export default function (state = null, action) {
  switch (action.type) {
    case CHECK_URL:
      return action.payload || false;
    case FETCH_LOCKS:
      return action.payload || false;
    case UPDATE_LOCK:
      return action.payload || false;
    default:
      return state;
  }
}