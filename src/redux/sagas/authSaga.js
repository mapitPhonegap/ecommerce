import {
  ON_AUTHSTATE_FAIL,
  ON_AUTHSTATE_SUCCESS, RESET_PASSWORD,
  SET_AUTH_PERSISTENCE,
  SIGNIN, SIGNIN_WITH_FACEBOOK,
  SIGNIN_WITH_GITHUB, SIGNIN_WITH_GOOGLE,
  SIGNOUT, SIGNUP
} from '@/constants/constants';
import { SIGNIN as ROUTE_SIGNIN, ADMIN_DASHBOARD } from '@/constants/routes';
import defaultAvatar from '@/images/defaultAvatar.jpg';
import defaultBanner from '@/images/defaultBanner.jpg';
import { call, put } from 'redux-saga/effects';
import { signInSuccess, signOutSuccess } from '@/redux/actions/authActions';
import { clearBasket, setBasketItems } from '@/redux/actions/basketActions';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import { resetFilter } from '@/redux/actions/filterActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import { clearProfile, setProfile } from '@/redux/actions/profileActions';
import { history } from '@/routers/AppRouter';
import supabase from '@/services/supabase';

function* handleError(e) {
  const obj = { success: false, type: 'auth', isError: true };
  yield put(setAuthenticating(false));

  switch (e.code) {
    case 'auth/network-request-failed':
      yield put(setAuthStatus({ ...obj, message: 'Network error has occured. Please try again.' }));
      break;
    case 'auth/email-already-in-use':
      yield put(setAuthStatus({ ...obj, message: 'Email is already in use. Please use another email' }));
      break;
    case 'auth/wrong-password':
      yield put(setAuthStatus({ ...obj, message: 'Incorrect email or password' }));
      break;
    case 'auth/user-not-found':
      yield put(setAuthStatus({ ...obj, message: 'Incorrect email or password' }));
      break;
    case 'auth/reset-password-error':
      yield put(setAuthStatus({ ...obj, message: 'Failed to send password reset email. Did you type your email correctly?' }));
      break;
    default:
      yield put(setAuthStatus({ ...obj, message: e.message }));
      break;
  }
}

function* initRequest() {
  yield put(setAuthenticating());
  yield put(setAuthStatus({}));
}

function* authSaga({ type, payload }) {
  switch (type) {
    case SIGNIN:
      try {
        yield initRequest();
        yield call(supabase.signIn, payload.email, payload.password);
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNIN_WITH_GOOGLE:
      try {
        yield initRequest();
        yield call(supabase.signInWithGoogle);
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNIN_WITH_FACEBOOK:
      try {
        yield initRequest();
        yield call(supabase.signInWithFacebook);
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNIN_WITH_GITHUB:
      try {
        yield initRequest();
        yield call(supabase.signInWithGithub);
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNUP:
      try {
        yield initRequest();
    
        // 1️⃣ Create account in Supabase Auth
        const user = yield call(supabase.createAccount, payload.email, payload.password);
        if (!user) throw error;
  
        console.log(user);
        const fullname = payload.fullname
        .split(' ')
        .map((name) => name[0].toUpperCase() + name.substring(1))
        .join(' ');
  
      // Proper user object
      const userProfile = {
        id: user.id,  // Ensure it's a valid UUID
        fullname,
        avatar: defaultAvatar,
        banner: defaultBanner,
        email: payload.email,
        role: "USER"
      };
  
      console.log("User Profile before insertion:", userProfile); // Debug log

       // 🔹 Insert user into 'users' table
    const { error: insertError } = yield call(supabase.addUser, userProfile);
    
    if (insertError) {
      throw new Error(insertError.message);
    }

    // 🔹 Show success message & ask for email confirmation
    yield put(setAuthStatus({
      success: true,
      message: "Sign up successful! Please check your email to verify your account."
    }));

  } catch (error) {
    yield put(setAuthStatus({ success: false, message: error.message }));
  } finally {
    yield put(setAuthenticating(false));
  }
  break;
    case SIGNOUT: {
      try {
        yield initRequest();
        yield call(supabase.signOut);
        yield put(clearBasket());
        yield put(clearProfile());
        yield put(resetFilter());
        yield put(resetCheckout());
        yield put(signOutSuccess());
        yield put(setAuthenticating(false));
        yield call(history.push, ROUTE_SIGNIN);
      } catch (e) {
        console.log(e);
      }
      break;
    }
    case RESET_PASSWORD: {
      try {
        yield initRequest();
        yield call(supabase.passwordReset, payload);
        yield put(setAuthStatus({
          success: true,
          type: 'reset',
          message: 'Password reset email has been sent to your provided email.'
        }));
        yield put(setAuthenticating(false));
      } catch (e) {
        handleError({ code: 'auth/reset-password-error' });
      }
      break;
    }
    case ON_AUTHSTATE_SUCCESS: {
      if (!payload?.id) {
        console.error("ON_AUTHSTATE_SUCCESS triggered but payload.id is undefined.");
        yield put({ type: ON_AUTHSTATE_FAIL });
        return;
      }
    
      const data = yield call(supabase.getSingleUser, payload.id);
      const user = data || payload; // Use fetched user data if available
      const userRole = user.role || "USER"; // Default to "USER" if undefined
    
      yield put(setProfile(user));
      yield put(setBasketItems(user.basket || []));
      yield put(signInSuccess({
        user: payload,
        id: payload.id,
        role: userRole,
        provider: payload?.provider || "email"
      }));
    
      // Retrieve intended route or default to home/admin dashboard
      const intendedRoute = localStorage.getItem("intendedRoute") || "/";
      localStorage.removeItem("intendedRoute"); // Clean up after redirect
    
      if (userRole === "ADMIN") {
        console.log("Redirecting to /admin/add...");
        history.push(ADMIN_DASHBOARD);
      } else {
        console.log(`Redirecting to ${intendedRoute}...`);
        history.push(intendedRoute); // Redirect to last intended page
      }
      break;
    }
    case ON_AUTHSTATE_FAIL: {
      yield put(clearProfile());
      yield put(signOutSuccess());
      break;
    }
    case SET_AUTH_PERSISTENCE: {
      try {
        yield call(supabase.setAuthPersistence);
      } catch (e) {
        console.log(e);
      }
      break;
    }
    default: {
      throw new Error('Unexpected Action Type.');
    }
  }
}

export default authSaga;
