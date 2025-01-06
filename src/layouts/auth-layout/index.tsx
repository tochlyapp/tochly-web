import React, { useEffect } from 'react';

import { useAppDispatch } from 'src/redux/hooks';
import { changeLayoutMode } from 'src/redux/slices/layout';

import LeftSidebarMenu from 'src/layouts/auth-layout/LeftSidebarMenu';

type AuthProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedLayoutMode = localStorage.getItem('layoutMode');
    if (storedLayoutMode) {
      dispatch(changeLayoutMode(storedLayoutMode));
    }
  }, [dispatch]);

  return (
    <div className="layout-wrapper d-lg-flex">
      {/* Left Sidebar Menu */}
      <LeftSidebarMenu />
      {/* Render Page Content */}
      {children}
    </div>
  );
};

export default AuthLayout;
