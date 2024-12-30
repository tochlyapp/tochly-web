import { Alert } from 'reactstrap';

export default function AuthenticatedView() {
  return (
    <div className="m-3 justify-content-center">
      <Alert color="primary">Kindly Signin or signup if you don't have an account.</Alert>
    </div>
  )
}
