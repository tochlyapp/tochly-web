import React from 'react';
import { Navigate } from 'react-router-dom';

const Chat = React.lazy(() => import('../pages/team/index'));
const Dashboard = React.lazy(() => import('../pages/dashbord/index'));

// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ActivateAccount = React.lazy(() => import('../pages/auth/ActivateAccount'));
const Google = React.lazy(() => import('../pages/auth/Google'));
const AcceptInvite = React.lazy(() => import('../pages/invitations/AcceptInvite'));

const authProtectedRoutes = [
  { path: '/teams/:tid', component: <Chat /> },
  { path: '*', component: <Navigate to="/" /> },
];

const publicRoutes = [
  { path: '/', component: <Dashboard />},
  { path: '/auth/login', component: <Login /> },
  { path: '/auth/forget-password', component: <ForgetPassword /> },
  { path: '/auth/register', component: <Register /> },
  { path: '/auth/google', component: <Google /> },
  { path: '/auth/activate/:uid/:token', component: <ActivateAccount /> },
  { path: '/invitations/accept-invite', component: <AcceptInvite /> },
];

export { authProtectedRoutes, publicRoutes };
