import axios from 'axios';
import {
  FETCH_LOCKS,
} from './types';

export const fetchLocks = ( data ) => async dispatch => {
  const res = await axios({
    method: 'post',
    url: '/api/fetch_locks',
    data: {
      userId: data
    }
  });
  dispatch({ type: FETCH_LOCKS, payload: res.data });
};

export const updateLockExpiry = ( data ) => async dispatch => {
  const { lockId, expiry } = data;
  await axios({
    method: 'post',
    url: '/api/update_expiry',
    data: {
      lockId: lockId,
      expiry: expiry
    }
  }).then((res) => {
    return res.status;
  });
}

export const deleteSelectedLock = ( data ) => async dispatch => {
  await axios({
    method: 'post',
    url: '/api/delete_lock',
    data: {
      lockId: data
    }
  }).then((res) => {
    return res.status;
  });
}
