import {
    GET_CONTACT,
    GET_CONTACT_SUCCESS, 
    SET_CONTACT
  } from '@/constants/constants';
  
  export const getContact = (id) => ({
    type: GET_CONTACT,
    payload: id
  });
  
  export const getContactSuccess = (contact) => ({
    type: GET_CONTACT_SUCCESS,
    payload: contact
  });
  

  export const setContact = (contact) => ({
    type: SET_CONTACT,
    payload: contact
  });
  