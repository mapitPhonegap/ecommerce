import {  SET_CONTACT } from '@/constants/constants';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_CONTACT:
      return {
        ...state, ...action.payload
      };
 
    default:
      return state;
  }
};
