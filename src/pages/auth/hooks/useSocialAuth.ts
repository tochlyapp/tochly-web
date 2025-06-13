import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'src/redux/hooks';
import { useAcceptInvitationMutation } from 'src/redux/services/invitation';

import { setAuth } from 'src/redux/slices/auth';
import { handleAcceptInvite } from 'src/lib/invitation';

export default function useSocialAuth(provider: string, authenticate: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const effectRan = useRef(false);

  const [acceptInvite] = useAcceptInvitationMutation();

  useEffect(() => {
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (state && code && !effectRan.current) {
      authenticate({ provider, state, code })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          const inviteToken = localStorage.getItem('invitationToken');
				  if (inviteToken) handleAcceptInvite(acceptInvite, t, inviteToken);
          toast.success(t('Logged in'));
          navigate('/');
        })
        .catch(() => {
          toast.error(t('Login failed!'));
          navigate('/auth/login');
        });
    }

    return () => {
      effectRan.current = true;
    };
  }, [provider, authenticate, searchParams]);
}
