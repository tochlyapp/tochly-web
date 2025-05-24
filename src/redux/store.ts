import { configureStore } from '@reduxjs/toolkit';

import { backendBaseAPI, chatBaseAPI } from 'src/redux/services/base/baseAPI';
import authReducer from 'src/redux/slices/auth';
import chatReducer from 'src/redux/slices/chat';
import layoutReducer from 'src/redux/slices/layout';

export const makestore = () => (
  configureStore({
    reducer: {
      auth: authReducer,
      chat: chatReducer,
      layout: layoutReducer,
      [backendBaseAPI.reducerPath]: backendBaseAPI.reducer,
      [chatBaseAPI.reducerPath]: chatBaseAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(backendBaseAPI.middleware, chatBaseAPI.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  })
);

export const store = makestore();

export type AppStore = ReturnType<typeof makestore>;
export type Appstate = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
