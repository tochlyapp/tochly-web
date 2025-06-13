import { toast } from 'react-toastify';
import { startChat, getSocket } from 'src/lib/socket';
import type { AcceptMemberInviteResp } from 'src/types/invitation';

export const handleAcceptInvite = (acceptInvite: Function, t: Function, token: string) => {
  acceptInvite({ token })
  .unwrap()
  .then((resp: AcceptMemberInviteResp) => {
    localStorage.removeItem('invitationToken');
    startChat(
      getSocket(), 
      {team_id: resp.data.tid, receiver_id: String(resp.data.user_id)}
    );
  })
  .catch((error: AcceptMemberInviteResp) => {
    if (error?.status === 406) {
      toast.error(t('Invitation token has expired!'));
    } else {
      toast.error(t('An unexpected error occurred. Please try again.'));
    }
  });
}
