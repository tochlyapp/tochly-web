import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from 'src/redux/hooks';
import { setAuth, finishLoading } from 'src/redux/slices/auth';
import { useVerifyMutation } from 'src/redux/services/auth';

const Authenticate: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [verify] = useVerifyMutation();

  useEffect(() => {
    verify(undefined)
    .unwrap()
    .then(() => {
      dispatch(setAuth());
    })
    .finally(() => {
      dispatch(finishLoading());
    }).catch(() => {
      // navigate('/auth/login');
    }).finally (() => {
      dispatch(finishLoading());
    });
  }, [dispatch, navigate, verify])
  return (
    <></>
  )
}

export default Authenticate;
