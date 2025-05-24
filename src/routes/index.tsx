import React, { Suspense } from 'react';
import { Routes as SwitchRoute, Route, Navigate, useLocation } from 'react-router-dom';

import NonAuthLayout from 'src/layouts/NonAuth';
import AuthLayout from 'src/layouts/auth-layout';

import { authProtectedRoutes, publicRoutes } from './routes';
import { useAppSelector } from 'src/redux/hooks';

type Props = {
  children: React.ReactNode;
  isAuthProtected?: boolean
}

const AuthProtected: React.FC<Props> = (props) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (props.isAuthProtected && !loading && !isAuthenticated) {
    return <Navigate to='/auth/login/' state={{ from: location }} replace />;
  }

  return <>{props.children}</>;
};

/**
 * Main Route Component
 */
const Routes = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <SwitchRoute>
          {/* Public routes */}
          {publicRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <NonAuthLayout>
                  {route.component}
                </NonAuthLayout>
              }
            />
          ))}

          {/* Auth-protected routes */}
          {authProtectedRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <AuthProtected isAuthProtected={true}>
                  <AuthLayout>{route.component}</AuthLayout>
                </AuthProtected>
              }
            />
          ))}
        </SwitchRoute>
      </Suspense>
    </React.Fragment>
  );
};

export default Routes;
