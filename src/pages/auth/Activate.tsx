import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import { Header } from 'src/pages/auth/components';
import { useActivateMutation } from 'src/redux/services/authAPI';

const Activation: React.FC = () => {
  const navigate = useNavigate();
  const effactRan = useRef(false)
  const { t } = useTranslation();
  const { uid, token } = useParams();

  const [activation] = useActivateMutation();

  useEffect(() => {
    if (!effactRan.current) {
      activation({ uid, token })
      .unwrap()
      .then(() => {
        toast.success(t('Account activated successfully!'))
      })
      .catch(() => {
        toast.error(t('Account activation failed'))
      })
      .finally(() => {
        navigate('/auth/login')
      })
    }

    return () => {
      effactRan.current = true
    }
  }, [activation, navigate, t, token, uid]);

  return (
    <div className='my-5 pt-sm-5'>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Header
              title={t("Activating your account...")}
              description=""
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Activation;
