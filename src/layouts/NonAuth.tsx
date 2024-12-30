import React, { useEffect } from 'react';

import { useAppDispatch } from 'src/redux/hooks';
import { changeLayoutMode } from 'src/redux/slices/layout';

type NonAuthProps = {
  children: React.ReactNode;
};

const NonAuth: React.FC<NonAuthProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedLayoutMode = localStorage.getItem("layoutMode");

    // Update layout mode from localStorage or fallback to default mode
    if (storedLayoutMode) {
      dispatch(changeLayoutMode(storedLayoutMode));
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default NonAuth;
