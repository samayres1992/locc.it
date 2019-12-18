import { 
  CLEAR_ERRORS,
} from './types';

export const clearErrors = () => async dispatch => {
  dispatch({ type: CLEAR_ERRORS, payload: null });
};
