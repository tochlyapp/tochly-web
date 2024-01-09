import Link from "next/link";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { Header } from "@/app/auth/components";


const NotFound: React.FC = () => {
  return (
    <div className="my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center text-center">
          <Header
            title="Page Not Found"
            description="We could't find the page you're looking for"
          />
          <Link href="/" className="justify-content-center text-center">
            <Button>Home</Button>
          </Link>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
