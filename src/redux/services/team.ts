import { backendBaseAPI } from 'src/redux/services/base/baseAPI';
import { Team } from 'src/pages/team/types/team';

const teamAPI = backendBaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
      query: () => '/teams/',
      providesTags: ['Team']
    }),
    getUserTeams: builder.query<Team[], void>({
      query: () => '/users/teams/',
      providesTags: ['Team']
    }),
    getTeam: builder.query<Team, string>({
      query: (tid) => `/teams/${tid}/`,
    }),
    getTeamByName: builder.query<Team[], string>({
      query: (name) => `/teams?name=${name}`,
    }),
    createTeam: builder.mutation({
      query: ({ name, description }) => ({
        url: '/teams/',
        method: 'POST',
        body: { name, description },
      }),
      invalidatesTags: ['Team']
    }),
    deleteTeam: builder.mutation({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team']
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetUserTeamsQuery,
  useGetTeamQuery,
  useGetTeamByNameQuery,
  useCreateTeamMutation,
  useDeleteTeamMutation,
} = teamAPI;
