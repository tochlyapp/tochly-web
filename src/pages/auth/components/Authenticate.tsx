import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from 'src/redux/hooks';
import { setAuth, finishLoading } from 'src/redux/slices/auth';
import { useVerifyMutation } from 'src/redux/services/authAPI';

type Props = {
  redirect?: boolean;
}

const Authenticate: React.FC<Props> = ({ redirect=true }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [verify] = useVerifyMutation();

  useEffect(() => {
    verify(undefined)
    .unwrap()
    .then(() => {
      dispatch(setAuth())
    })
    .finally(() => {
      dispatch(finishLoading())
    }).catch(() => {
      redirect && navigate('/auth/login');
    });
  }, [dispatch, navigate, verify])
  return (
    <></>
  )
}

export default Authenticate;
