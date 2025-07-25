import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';

import EditProfile from 'src/pages/chat/tabs/profile/EditProfile'

const ProfileActionBar: React.FC = () => {
	const { t } = useTranslation();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [openEditForm, setOpenEditForm] = useState(false);

	const toggle = () => setDropdownOpen(!dropdownOpen);
	const showEditForm = () => {
		setOpenEditForm(true)
	}

	return (
		<div className="user-chat-nav float-end">
			<Dropdown isOpen={dropdownOpen} toggle={toggle}>
				<DropdownToggle
					tag="a"
					className="font-size-18 text-muted dropdown-toggle"
				>
					<i className="ri-more-2-fill"></i>
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu-end">
					<DropdownItem onClick={showEditForm}>{t("Edit")}</DropdownItem>
					<DropdownItem>{t("Action")}</DropdownItem>
					<DropdownItem divider />
					<DropdownItem>{t("Another action")}</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			{openEditForm && <EditProfile toggleProfileForm={setOpenEditForm} />}
		</div>
	)
}

export default ProfileActionBar;
