import { Link } from 'react-router-dom';
import {
  Alert,
  Container,
  Button,
  Card,
  CardBody,
  CardTitle,
  Spinner,
} from "reactstrap";

import { useGetUserTeamsQuery } from 'src/redux/services/team';


export default function UserTeams() {
  const { data: userTeams, isLoading: loadingTeams, isError: teamsError } = useGetUserTeamsQuery();

  if (loadingTeams) {
    return (
      <div className="m-3 text-center">
        <Spinner color="primary" />
        <p aria-label="loading">Loading...</p>
      </div>
    );
  }

  if (teamsError) {
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
      <div className="landing-page">
        <Container className="team-section">
          {userTeams && userTeams.length > 0 ? (
            userTeams.map(team => (
              <Card key={team.id} className="team-card">
                <CardBody className="d-flex justify-content-between align-items-center">
                  <CardTitle tag="h5" className="team-title">{team.name}</CardTitle>
                  <Link aria-label={`team-link-${team.tid}`} to={`/teams/${team.tid}`}>
                    <Button color="primary" className="open-btn">Open</Button>
                  </Link>
                </CardBody>
              </Card>
            ))
          ) : (
            <Alert color="info">No teams found.</Alert>
          )}
        </Container>
      </div>
    </div>
  );
}
