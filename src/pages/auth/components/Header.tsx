import React from 'react';
import { Link } from 'react-router-dom';

import logodark from 'src/assets/images/logo-dark.png';
import logolight from 'src/assets/images/logo-light.png';

type HeaderProps = {
  title: string;
  description: string;
};

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
  <div className="text-center mb-4">
    <Link to="/" className="auth-logo mb-5 d-block">
      <picture>
        <source srcSet={logolight} media="(prefers-color-scheme: light)" />
        <img src={logodark} alt="Logo" height="30" className="logo" />
      </picture>
    </Link>

    <h4 role="title" className="auth-title">{title}</h4>
    <p className="text-muted mb-4">{description}</p>
  </div>
)};

export default Header;
