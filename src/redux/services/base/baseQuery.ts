import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { reconnectSocket } from 'src/lib/socket';
import { setAuth, logout } from 'src/redux/slices/auth';

const mutex = new Mutex();

export const getBaseQuery = (
  baseQuery: any,
  refreshUrl: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      if (!mutex.isLocked() && refreshUrl) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQuery(
            {
              url: refreshUrl,
              method: 'POST',
            },
            api,
            extraOptions
          );
          if (refreshResult.data) {
            api.dispatch(setAuth());
            reconnectSocket();
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

  return baseQueryWithReauth;
};
