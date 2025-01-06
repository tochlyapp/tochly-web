import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import classnames from 'classnames';

import { useLogoutMutation, usePatchCurrentUserProfileMutation } from 'src/redux/services/authAPI';
import { logout as logoutState } from 'src/redux/slices/auth';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setActiveTab, changeLayoutMode } from 'src/redux/slices/layout';

import logo from 'src/assets/images/logo.svg';
import avatar1 from 'src/assets/images/users/avatar-1.jpg';

import usFlag from 'src/assets/images/flags/us.jpg';
import spain from 'src/assets/images/flags/spain.jpg';
import germany from 'src/assets/images/flags/germany.jpg';
import italy from 'src/assets/images/flags/italy.jpg';
import russia from 'src/assets/images/flags/russia.jpg';

import i18n from 'src/i18n';
import { NavItemWithTooltip } from 'src/components';

type DropdownType = 'general' | 'language' | 'mobile';
type LanguagesCode = 'eng' | 'sp' | 'gr' | 'rs' | 'it';

type DropdownsType = {
  [k in DropdownType]: boolean;
};

const LeftSidebarMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();
  const [patchCurrentUserProfile] = usePatchCurrentUserProfileMutation();

  const { layoutMode, activeTab } = useAppSelector((state) => state.layout);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [dropdowns, setDropdowns] = useState<DropdownsType>({
    general: false,
    language: false,
    mobile: false,
  });

  const [lng, setLng] = useState<LanguagesCode>('eng');

  const languageOptions = useMemo(
    () => [
      { code: 'eng', name: 'English', flag: usFlag },
      { code: 'sp', name: 'Spanish', flag: spain },
      { code: 'gr', name: 'German', flag: germany },
      { code: 'it', name: 'Italian', flag: italy },
      { code: 'rs', name: 'Russian', flag: russia },
    ],
    []
  );

  const mode = layoutMode === 'dark' ? 'light' : 'dark';

  const toggleDropdown = (key: DropdownType) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onChangeLayoutMode = useCallback(
    (value: 'light' | 'dark') => {
      patchCurrentUserProfile({ dark_mode: value === 'dark' })
        .unwrap()
        .then(() => {
          document.body.setAttribute('data-bs-theme', value);
          dispatch(changeLayoutMode(value));
        })
        .catch(() => {
          toast.error(t('An unexpected error occurred. Please try again.'));
        });
    },
    [dispatch, patchCurrentUserProfile, t]
  );

  const toggleTab = useCallback(
    (tab: string) => {
      dispatch(setActiveTab(tab));
      localStorage.setItem('activeTab', tab);
    },
    [dispatch]
  );

  const changeLanguageAction = useCallback(
    (lang: LanguagesCode) => {
      i18n.changeLanguage(lang);
  
      setLng(lang);
    },
  []);

  const handleLogout = useCallback(() => {
    if (window.confirm(t('Are you sure you want to log out?'))) {
      logout(undefined)
        .unwrap()
        .then(() => {
          dispatch(logoutState());
          toast.success(t('Logged out successfully'));
        })
        .catch(() => {
          toast.error(t('An unexpected error occurred. Please try again.'));
        });
    }
  }, [dispatch, logout, t]);

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      dispatch(setActiveTab(storedTab));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="side-menu flex-lg-column me-lg-1">
      <div className="navbar-brand-box">
        <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src={logo} alt="logo" height="30" />
          </span>
        </Link>
        <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img role="logo" src={logo} alt="logo" height="30" />
          </span>
        </Link>
      </div>

      {/* Side Menu */}
      <div className="flex-lg-column my-auto">
        <Nav className="side-menu-nav nav-pills justify-content-center" role="tablist">
          {['profile', 'chat', 'group', 'contacts', 'settings'].map((tab: string) => (
            <NavItemWithTooltip
              id={tab}
              key={tab}
              iconClassName={`ri-${tab === 'profile' ? 'user-2' : tab === 'chat' ? 'message-3' : tab}-line`}
              NavLinkClassName={classnames({ active: activeTab === tab }) + ' mb-2'}
              tooltip={tab.charAt(0).toUpperCase() + tab.slice(1)}
              onClick={() => toggleTab(tab)}
              aria-label={tab}
            />
          ))}
        </Nav>
      </div>

      {/* Language and Theme Toggles */}
      <div className="flex-lg-column d-none d-lg-block">
        <Nav className="side-menu-nav justify-content-center">
          <Dropdown
            nav
            isOpen={dropdowns.language}
            toggle={() => toggleDropdown('language')}
            className="btn-group dropup profile-user-dropdown"
          >
            <DropdownToggle nav>
              <i aria-label="global-icon" className="ri-global-line"></i>
            </DropdownToggle>
            <DropdownMenu>
              {languageOptions.map((lang) => (
                <DropdownItem
                  key={lang.code}
                  onClick={() => changeLanguageAction(lang.code as LanguagesCode)}
                  active={lng === lang.code}
                >
                  <img src={lang.flag} alt={lang.name} className="me-1" height="12" />{' '}
                  <span className="align-middle">{lang.name}</span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <NavItemWithTooltip
            id="light-dark"
            iconClassName="ri-sun-line theme-mode-icon"
            NavLinkClassName="mb-2"
            tooltip="Dark / Light Mode"
            onClick={() => onChangeLayoutMode(mode)}
            aria-label="light-dark"
          />

          <Dropdown
            nav
            isOpen={dropdowns.general}
            toggle={() => toggleDropdown('general')}
            className="nav-item btn-group dropup profile-user-dropdown"
          >
            <DropdownToggle className="nav-link mb-2" tag="a">
              <img src={avatar1} alt="user" className="profile-user rounded-circle" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => toggleTab('profile')}>
                Profile <i className="ri-profile-line float-end text-muted"></i>
              </DropdownItem>
              <DropdownItem onClick={() => toggleTab('settings')}>
                Setting <i className="ri-settings-3-line float-end text-muted"></i>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogout}>
                Log out <i className="ri-logout-circle-r-line float-end text-muted"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </div>
    </div>
  );
};

export default LeftSidebarMenu;
