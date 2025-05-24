import { backendBaseAPI } from 'src/redux/services/base/baseAPI';
import { TeamMember } from 'src/types';

type MembersParams = {
  tid: string;
  search?: string;
}

const memberAPI = backendBaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMember[],  MembersParams>({
      query: ({ tid, search }) => `/teams/${tid}/members/?search=${search}&limit=50`,
    }),
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
  useGetTeamMembersQuery,
  useLazyGetTeamMembersQuery,
  useCreateTeamMemberMutation,
} = memberAPI;
