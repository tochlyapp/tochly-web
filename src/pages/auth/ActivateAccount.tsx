import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Header from 'src/pages/auth/components/Header';
import { useActivateMutation } from 'src/redux/services/auth';

const ActivateAccount: React.FC = () => {
  const navigate = useNavigate();
  const effectRan = useRef(false)
  const { t } = useTranslation();
  const { uid, token } = useParams();

  const [activate] = useActivateMutation();

  useEffect(() => {
    if (!effectRan.current) {
      if (!uid || !token) {
        toast.error(t('Invalid activation parameters.'));
        navigate('/auth/login');
        return;
      }

      const activateAccount = async () => {
        try {
          await activate({ uid, token }).unwrap();
          toast.success(t('Account activated successfully!'));
        } catch {
          toast.error(t('Account activation failed'));
        } finally {
          navigate('/auth/login');
        }
      };

      activateAccount();
    }

    return () => {
      effectRan.current = true
    }
  }, [activate, navigate, t, token, uid]);

  return (
    <div className="my-5 pt-sm-5">
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

export default ActivateAccount;
