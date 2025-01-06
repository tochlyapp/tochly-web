import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { useAppDispatch } from 'src/redux/hooks';
import { changeLayoutMode } from 'src/redux/slices/layout';
import { useGetCurrentUserProfileQuery } from 'src/redux/services/authAPI';

import Routes from 'src/routes';

import 'src/assets/scss/themes.scss';

function App() {
  const dispatch = useAppDispatch();
  const { data: profile, isLoading } = useGetCurrentUserProfileQuery();

  useEffect(() => {
    if (!isLoading) {
      const selectedTheme = profile?.dark_mode? 'dark' : 'light';
      document.body.setAttribute('data-bs-theme', selectedTheme);
      dispatch(changeLayoutMode(selectedTheme));
    }
  }, [profile, isLoading, dispatch]);

  return (
    <>
      <Routes />
      <ToastContainer />
    </>
  );
};

export default App;
