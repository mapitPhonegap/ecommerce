import { call, put, select } from 'redux-saga/effects';
import { history } from '@/routers/AppRouter';
import supabase from '@/services/supabase';
import { setLoading } from '../actions/miscActions';
import { getSingleUserSuccess } from '../actions/userActions';

function* userSaga({ type, payload }) {
  switch (type) {
    case GET_USER: {
      try {
        yield put(setLoading(false));
        const result = yield call(supabase.getSingleUser, payload);

        if (!result) {
          handleError('No item found.');
        } else {
          yield put(getSingleUserSuccess(result));
          yield put(setRequestStatus(''));
        }
        yield put(setLoading(false));
      } catch (e) {
        console.log(e.message);
      }
      break;
    }

    default: {
      throw new Error('Unexpected action type.');
    }
  }
}

export default userSaga;
