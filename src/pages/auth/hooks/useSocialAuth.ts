import { useEffect, useRef } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';

import { useAppDispatch } from 'src/redux/hooks';
import { setAuth } from 'src/redux/slices/auth';

export default function useSocialAuth(provider: string, authenticate: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const effectRan = useRef(false);

  useEffect(() => {
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (state && code && !effectRan.current) {
      authenticate({ provider, state, code })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
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
  }, [provider, authenticate]);
}
