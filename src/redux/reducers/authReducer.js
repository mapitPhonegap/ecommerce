import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS, ON_AUTHSTATE_SUCCESS } from '@/constants/constants';

const initState = null;
// {
// id: 'test-123',
// role: 'ADMIN',
// provider: 'password'
// };

export default (state = null, action) => {
  console.log("Reducer Triggered:", action.type, action.payload);
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return {
        user: action.payload,
        id: action.payload.id,
        role: action.payload.role,
        provider: action.payload.provider
      };
    case ON_AUTHSTATE_SUCCESS:  // Add this case
      return {
        user: action.payload,
        id: action.payload.id,
        role: action.payload.role || 'USER',  // Default role if not provided
        provider: action.payload.provider || 'email'  // Default provider
      };
    case SIGNOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};

