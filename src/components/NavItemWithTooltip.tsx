import { NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';

type Props = {
  id: string;
  iconClassName: string;
  NavLinkClassName?: string;
  tooltip: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  'aria-label'?: string;
}

const NavItemWithTooltip: React.FC<Props> = ({
  id,
  iconClassName,
  tooltip,
  onClick,
  NavLinkClassName = '',
  'aria-label': ariaLabel = tooltip,
}) => (
  <NavItem id={id}>
    <NavLink className={NavLinkClassName} onClick={onClick} aria-label={ariaLabel}>
      <i className={iconClassName}></i>
    </NavLink>
    <UncontrolledTooltip target={id} placement="top">
      {tooltip}
    </UncontrolledTooltip>
  </NavItem>
);

export default NavItemWithTooltip;
