import { backendBaseAPI } from 'src/redux/services/base/baseAPI';
import { TeamMemberBase, TeamMember } from 'src/types/member';

type MembersParams = {
  tid: string;
  userId?: string;
  search?: string;
}

type TeamMemberCreate = TeamMemberBase & {
  teamTid: string;
  user: number
}

const memberAPI = backendBaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMember[],  MembersParams>({
      query: ({ tid, userId, search }) => {
        const params = new URLSearchParams();
        params.set('limit', '50');
        if (search) params.set('search', search);
        if (userId) params.set('user_id', userId);
        return `/teams/${tid}/members/?${params.toString()}`
      },
      providesTags: ['Member']
    }),
    createTeamMember: builder.mutation<TeamMember, TeamMemberCreate>({
      query: ({ user, teamTid, display_name, role }) => ({
        url: `/teams/${teamTid}/members/`,
        method: 'POST',
        body: { user, role, display_name},
      }),
      invalidatesTags: ['Team']
    }),
    patchCurrentTeamMember: builder.mutation({
      query: ({teamTid, id, data}) => ({
        url: `/teams/${teamTid}/members/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Member']
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useLazyGetTeamMembersQuery,
  useCreateTeamMemberMutation,
  usePatchCurrentTeamMemberMutation,
} = memberAPI;
