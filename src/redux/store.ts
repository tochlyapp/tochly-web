import { configureStore } from '@reduxjs/toolkit';

import { baseAPI } from 'src/redux/services/baseAPI';
import authReducer from 'src/redux/slices/auth';
import chatReducer from 'src/redux/slices/chat';
import layoutReducer from 'src/redux/slices/layout';


export const makestore = () => (
  configureStore({
    reducer: {
      auth: authReducer,
      chat: chatReducer,
      layout: layoutReducer,
      [baseAPI.reducerPath]: baseAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  })
);

export type AppStore = ReturnType<typeof makestore>;
export type Appstate = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
