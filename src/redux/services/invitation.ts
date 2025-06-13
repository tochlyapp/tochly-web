import { backendBaseAPI } from 'src/redux/services/base/baseAPI';
import type { AcceptMemberInviteResp } from 'src/types/invitation';

type SendMemberInviteData = {
	tid: string;
	inviteeEmail: string;
	role: string;
	invitedBy: number;
	url: string;
}

type AcceptMemberInviteData = {
	token: string;
}

type MemberSendInviteResp = {
	detail: string;
}

export const invitationAPIs = backendBaseAPI.injectEndpoints({
	endpoints: (builder) => ({
		sendInvitation: builder.mutation<MemberSendInviteResp, SendMemberInviteData>({
			query: ({ tid, inviteeEmail, role, invitedBy, url }) => ({
				url: `/invitations/send-invite/`,
				method: 'POST',
				body: { 
					tid, 
					role,
					url,
					invitee_email: inviteeEmail, 
					invited_by: invitedBy,
				},
			}),
		}),
		acceptInvitation: builder.mutation<AcceptMemberInviteResp, AcceptMemberInviteData>({
			query: (data) => ({
				url: `/invitations/accept-invite/`,
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export const {
	useSendInvitationMutation,
	useAcceptInvitationMutation,
} = invitationAPIs;
