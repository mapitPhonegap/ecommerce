/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import { ADMIN_DASHBOARD, SIGNIN } from '@/constants/routes';
import PropType from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import supabase from '@/services/supabase';

const PrivateRoute = ({ isAuth, role, component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(isAuth);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Changed in PrivateRoute:", event, session);

      if (event === "SIGNED_IN" && session?.user) {
        dispatch(onAuthStateSuccess(session.user)); // ✅ Update Redux store
      } else if (event !== "INITIAL_SESSION") {
        dispatch(onAuthStateFail('Session expired'));
      }
    });

    return () => {
      listener?.subscription?.unsubscribe(); // ✅ Cleanup on unmount
    };
  }, [dispatch]);
  return (
    <Route
      {...rest}
      component={(props) => {
        if (isAuthenticated && ( role === 'USER' || role === 'authenticated')) {
          return (
            <main className="content">
              <Component {...props} />
            </main>
          );
        }

        if (isAuthenticated && role === 'ADMIN') {
          return <Redirect to={ADMIN_DASHBOARD} />;
        }

        return <Redirect to={{ pathname: SIGNIN, state: { from: props.location } }} />;
      }}
    />
  );
};

PrivateRoute.defaultProps = {
  isAuth: false,
  role: 'USER'
};

PrivateRoute.propTypes = {
  isAuth: PropType.bool,
  role: PropType.string,
  component: PropType.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  rest: PropType.any
};

const mapStateToProps = ({ auth }) => ({
  isAuth: !!(auth || JSON.parse(localStorage.getItem("supabaseAuthSession"))),
  role: auth?.role || 'USER'
});

export default connect(mapStateToProps)(PrivateRoute);
