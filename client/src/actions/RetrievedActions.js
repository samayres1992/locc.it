import axios from 'axios';
import { 
  CHECK_URL
} from './types';

export const checkUrl = ( data ) => async dispatch => {
  const res = await axios({
    method: 'post',
    url: '/api/check_url',
    data: {
      url: data
    }
  });
  dispatch({ type: CHECK_URL, payload: res.data });
}