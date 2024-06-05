import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/redux/slices/authSlice';
import { baseAPI } from '@/redux/services/baseAPI';


export const makestore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [baseAPI.reducerPath]: baseAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseAPI.middleware),
  });

export type AppStore = ReturnType<typeof makestore>;
export type Appstate = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
