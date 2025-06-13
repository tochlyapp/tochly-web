export type AcceptMemberInviteResp = {
	status: number;
	detail: string;
	data: {
		user_id: number,
		tid: string
	}
}
