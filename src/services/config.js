const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const supabaseConfig = {
  supabaseURL: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  anonKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
  publicURL: import.meta.env.VITE_PUBLIC_SITE_URL,
};

export { firebaseConfig, supabaseConfig };