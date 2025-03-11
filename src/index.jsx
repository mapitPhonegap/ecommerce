import { Preloader } from '@/components/common';
import 'normalize.css/normalize.css';
import React from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import { onAuthStateFail, onAuthStateSuccess } from '@/redux/actions/authActions';
import configureStore from '@/redux/store/store';
import '@/styles/style.scss';
import WebFont from 'webfontloader';
import App from './App';
import supabase from '@/services/supabase';

WebFont.load({
  google: {
    families: ['Tajawal']
  }
});

const { store, persistor } = configureStore();
const root = document.getElementById('app');

// Render the preloader on initial load
render(<Preloader />, root);
// supabase.auth.onAuthStateChange((event, session) => {
//   console.log("Auth State Changed:", event, session);

//   if (event === "SIGNED_IN" && session?.user) {
//     console.log("Dispatching ON_AUTHSTATE_SUCCESS:", session.user);
//     store.dispatch(onAuthStateSuccess(session.user));

//     setTimeout(() => {
//       const authState = store.getState().auth || {};
//       console.log("Updated Redux Store (auth):", store.getState().auth);
//       // if (authState.isAuthenticated) {
//       //   history.push('/');
//       // }
//     }, 500);
//   } else if (event !== "INITIAL_SESSION") { // Avoid resetting on initial session check
//     console.log("Dispatching ON_AUTHSTATE_FAIL");
//     store.dispatch(onAuthStateFail('Failed to authenticate'));
//   }

//   // Render the app
//   render(<App store={store} persistor={persistor} />, root);
// });

supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth State Changed:", event, session);

  if (event === "SIGNED_IN" && session?.user) {
    console.log("Dispatching ON_AUTHSTATE_SUCCESS:", session.user);
    store.dispatch(onAuthStateSuccess(session.user));
  } else if (event !== "INITIAL_SESSION") { // Avoid resetting on initial session check
    console.log("Dispatching ON_AUTHSTATE_FAIL");
    store.dispatch(onAuthStateFail('Failed to authenticate'));
  }

  // Store the intended route before rendering
  const lastPath = window.location.pathname;
  localStorage.setItem("intendedRoute", lastPath); 

  // Render the app
  render(<App store={store} persistor={persistor} />, root);
});

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
