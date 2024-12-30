import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { setAuth, logout } from 'src/redux/slices/auth';


const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_BACKEND_API}/api`,
  credentials: 'include',
});


const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: '/jwt/refresh/',
            method: 'POST',
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          api.dispatch(setAuth());
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Team', 'Member'],
  endpoints: () => ({}),
});