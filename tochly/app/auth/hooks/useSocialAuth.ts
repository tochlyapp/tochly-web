import { useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'react-toastify';

import { useAppDispatch } from '@/redux/hooks';
import { setAuth } from '@/redux/slices/authSlice';


export default function useSocialAuth(provider: string, authenticate: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectRan = useRef(false);

  useEffect(() => {
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (state && code && !effectRan.current) {
      authenticate({ provider, state, code })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          toast.success("Logged in");
          router.push('/');
        })
        .catch(() => {
          toast.error("Login failed!");
          router.push('/auth/login');
        });
    }

    return () => {
      effectRan.current = true;
    };
  }, [provider, authenticate]);
}
