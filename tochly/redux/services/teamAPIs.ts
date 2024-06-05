import { baseAPI } from "@/redux/services/baseAPI";


type Team = {
  id?: number;
  name: string;
  description: string;
  tid: string;
  created: string;
};

const teamAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
      query: () => '/teams/',
      providesTags: ['Teams']
    }),
    getUserTeams: builder.query<Team[], void>({
      query: () => '/user/teams/',
      providesTags: ['Teams']
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
      invalidatesTags: ['Teams']
    }),
    deleteTeam: builder.mutation({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teams']
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
