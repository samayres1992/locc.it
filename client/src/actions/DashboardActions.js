import axios from 'axios';
import {
  FETCH_LOCKS,
  SET_ERRORS
} from './types';

export const fetchLocks = (data) => async dispatch => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/fetch_locks',
      data: {
        userId: data
      }
    });
    dispatch({ type: FETCH_LOCKS, payload: res.data });
  }
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { dashboard: "Unable to fetch user's encrypted credentials." }});
    console.log("error", errors);
  }
};

export const updateLockExpiry = ({ lockId, expiry } ) => async dispatch => {
  try {
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
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { dashboard: "Unable to update lock expiry date." }});
    console.log("error", errors);
  }
}

export const deleteSelectedLock = (data) => async dispatch => {
  try {
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
  catch (errors) {
    dispatch({ type: SET_ERRORS, payload: { dashboard: "Unable to delete encrypted credentials." }});
    console.log("error", errors);
  }
}
