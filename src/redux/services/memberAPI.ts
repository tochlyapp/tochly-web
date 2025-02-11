import { baseAPI } from 'src/redux/services/baseAPI';

const memberAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createTeamMember: builder.mutation({
      query: ({ user, teamTid, role, isActive }) => ({
        url: `/teams/${teamTid}/members/`,
        method: 'POST',
        body: { user, role, is_active: isActive },
      }),
      invalidatesTags: ['Team']
    }),
  }),
});

export const {
  useCreateTeamMemberMutation,
} = memberAPI;
