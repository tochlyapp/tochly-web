import { baseAPI } from 'src/redux/services/baseAPI';


const memberAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createTeamMember: builder.mutation({
      query: ({ user, teamId, permission, isActive }) => ({
        url: `/teams/${teamId}/members/`,
        method: 'POST',
        body: { user, permission, is_active: isActive },
      }),
      invalidatesTags: ['Team']
    }),
  }),
});

export const {
  useCreateTeamMemberMutation,
} = memberAPI;
