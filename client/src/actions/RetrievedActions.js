import axios from 'axios';
import { 
  CHECK_URL,
  SET_ERRORS
} from './types';

export const checkUrl = (data) => async dispatch => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/check_url',
      data: {
        url: data
      }
    });
    dispatch({ type: CHECK_URL, payload: res.data });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { user: "Unable to verify if credentials exist." }});
    console.log("error", errors);
  }
}