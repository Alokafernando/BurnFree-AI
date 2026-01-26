import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loaderReducer from './slices/loaderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;