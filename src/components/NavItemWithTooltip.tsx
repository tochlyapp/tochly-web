import { NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';

type Props = {
  id: string;
  key?: string | number;
  iconClassName: string;
  NavLinkClassName: string;
  tooltip: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  'aria-label'?: string;
}

const NavItemWithTooltip: React.FC<Props> = (props) => (
  <NavItem id={props.id} key={props.id}>
    <NavLink className="mb-2" onClick={props.onClick} aria-label={props["aria-label"]}>
      <i className={props.iconClassName}></i>
    </NavLink>
    <UncontrolledTooltip target={props.id} placement="top">
      {props.tooltip}
    </UncontrolledTooltip>
  </NavItem>
);

export default NavItemWithTooltip;
