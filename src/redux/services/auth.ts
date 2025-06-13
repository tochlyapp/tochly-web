import { backendBaseAPI } from 'src/redux/services/base/baseAPI';
import { User, BaseUser } from 'src/types/user';

type Profile = {
  id: number;
  user: number,
  timezone: string | null;
  dark_mode: boolean;
}

type CreateUserArgs = BaseUser & {
  password: string;
  re_password: string;
};

type CreateUserResponse = {
  success: boolean;
  user: User;
};

type SocialAuthArgs = {
  provider: string;
  state: string;
  code: string;
};

const authAPI = backendBaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/users/me/',
    }),
    socialAuthenticate: builder.mutation<CreateUserResponse, SocialAuthArgs>({
      query: ({ provider, state, code }) => ({
        url: `/o/${provider}/?state=${encodeURIComponent(
          state
        )}&code=${encodeURIComponent(code)}`,
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/jwt/create/',
        method: 'POST',
        body: { email, password },
      }),
    }),
    signUp: builder.mutation<CreateUserResponse, CreateUserArgs>({
      query: ({ first_name, last_name, email, password, re_password }) => ({
        url: '/auth/users/',
        method: 'POST',
        body: { first_name, last_name, email, password, re_password },
      }),
    }),
    verify: builder.mutation({
      query: () => ({
        url: '/jwt/verify/',
        method: 'POST',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout/',
        method: 'POST',
      }),
    }),
    activate: builder.mutation({
      query: ({ uid, token }) => ({
        url: '/users/activation/',
        method: 'POST',
        body: { uid, token },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/users/reset_password/',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: '/users/reset_password_confirm/',
        method: 'POST',
        body: { uid, token, new_password, re_new_password },
      }),
    }),
    getCurrentUserProfile: builder.query<Profile, void>({
      query: () => '/profiles/me/',
    }),
    patchCurrentUserProfile: builder.mutation({
      query: (data) => ({
        url: '/profiles/me/',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useSocialAuthenticateMutation,
  useLoginMutation,
  useSignUpMutation,
  useVerifyMutation,
  useLogoutMutation,
  useActivateMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
  useGetCurrentUserProfileQuery,
  usePatchCurrentUserProfileMutation,
} = authAPI;
