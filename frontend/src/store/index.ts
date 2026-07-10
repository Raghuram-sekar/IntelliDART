import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import tutorReducer from './slices/tutorSlice';
import sessionReducer from './slices/sessionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tutor: tutorReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 