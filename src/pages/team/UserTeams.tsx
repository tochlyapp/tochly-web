import { Link } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardBody, 
  CardSubtitle,
  Spinner,
  Alert,
} from 'reactstrap';

import { useGetUserTeamsQuery } from 'src/redux/services/teamAPIs';
import { useGetCurrentUserQuery } from 'src/redux/services/authAPI';

export default function UserTeams() {
  const { data: userTeams, isLoading: loadingTeams, isError: teamsError } = useGetUserTeamsQuery();
  const { data: currentUser, isLoading: loadingUser, isError: userError } = useGetCurrentUserQuery();

  if (loadingTeams || loadingUser) {
    return (
      <div className="m-3 text-center">
        <Spinner color="primary" />
        <p aria-label="loading">Loading...</p>
      </div>
    );
  }

  if (teamsError || userError) {
    return (
      <div className="m-3">
        <Alert color="danger">
          Something went wrong. Please try again later.
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="m-3">
      <Card>
        <CardHeader className="bg-dark text-white">
          Teams for <span aria-label="user-email">{currentUser?.email || 'Unknown User'}</span>
        </CardHeader>
        <CardBody>
          {userTeams && userTeams.length > 0 ? (
            userTeams.map(team => (
              <div key={team.id} className="d-flex align-items-center mb-3">
                <CardSubtitle className="me-3">{team.name}</CardSubtitle>
                <div className="ms-auto">
                  <Link aria-label={`team-link-${team.tid}`} to={`/team/${team.tid}`}>
                    <Button color="primary">Open</Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <Alert color="info">No teams found.</Alert>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
