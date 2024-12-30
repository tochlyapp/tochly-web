import { useAppSelector } from 'src/redux/hooks';

import TopNavbar from 'src/pages/dashbord/TopNavbar';
import AuthenticatedView from 'src/pages/dashbord/AuthenticatedView';
import UnAuthenticatedView from 'src/pages/dashbord/UnAuthenticatedView';

export default function Dashboard() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <TopNavbar />

      {isAuthenticated ? (
        <AuthenticatedView />
      ) : (
        <UnAuthenticatedView />
      )}
    </main>
  );
}