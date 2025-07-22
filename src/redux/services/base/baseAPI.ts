import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getBaseQuery } from './baseQuery';

const backendBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_BACKEND_API}/api`,
  credentials: 'include',
});

const chatBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_CHAT_API}/api`,
  credentials: 'include',
});

export const backendBaseAPI = createApi({
  reducerPath: 'backendApi',
  baseQuery: getBaseQuery(backendBaseQuery, '/jwt/refresh/'),
  tagTypes: ['Team', 'Member'],
  endpoints: () => ({}),
});

export const chatBaseAPI = createApi({
  reducerPath: 'chatApi',
  baseQuery: getBaseQuery(chatBaseQuery, ''),
  tagTypes: ['Chat', 'ChatRoom', 'ChatMessage'],
  endpoints: () => ({}),
});
