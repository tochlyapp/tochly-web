import { Link } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardBody, 
  CardSubtitle 
} from 'reactstrap';

import { useGetUserTeamsQuery } from 'src/redux/services/teamAPIs';
import { useGetCurrentUserQuery } from 'src/redux/services/authAPI';


export default function UserTeams() {
  const { data: userTeams } = useGetUserTeamsQuery();
  const { data: currentUser } = useGetCurrentUserQuery();
  
  return (
    <div className="m-3">
      <Card>
        <CardHeader className="bg-dark text-white">
          Teams for <span>{currentUser?.email || 'Unknown'}</span>
        </CardHeader>
        <CardBody>
          
          {userTeams?.map(team => (
            <div key={team.id} className="d-flex">
              <CardSubtitle>{team.name}</CardSubtitle>
              <div className="ms-auto my-2">
                <Link to={`/team/${team.tid}`}><Button>Open</Button></Link>
              </div>
            </div>
        ))}
        </CardBody>
      </Card>
    </div>
  );
}
