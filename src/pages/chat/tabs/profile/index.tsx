import React, { useState } from "react";
import { Card, Button } from "reactstrap";
import { useAppSelector, useAppDispatch } from 'src/redux/hooks';

import { useGetCurrentUserQuery } from 'src/redux/services/auth';
import { closeUserSidebar } from 'src/redux/slices/layout';

//Import components
import { CustomCollapse, AttachedFiles } from 'src/components';
import ProfileActionBar from './ProfileActionBar';

//i18n
import { useTranslation } from "react-i18next";

import type { TeamMember } from 'src/types/member';
import { getCurrentTimeInTimezone } from 'src/utils/date';

type Props = {
	member: TeamMember | null;
	canClose?: boolean;
}

const Profile: React.FC<Props> = ({ member, canClose=false }) => {
  const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  const [files] = useState([
    { name: "Admin-A.zip", size: "12.5 MB", thumbnail: "ri-file-text-fill" },
    { name: "Image-1.jpg", size: "4.2 MB", thumbnail: "ri-image-fill" },
    { name: "Image-2.jpg", size: "3.1 MB", thumbnail: "ri-image-fill" },
    { name: "Landing-A.zip", size: "6.7 MB", thumbnail: "ri-file-text-fill" },
  ]);

	const userSidebar = useAppSelector((state) => state.layout.userSidebar);

	const { data: currentUser } = useGetCurrentUserQuery();
	const isCurrentUser = member?.user.id === currentUser?.id;

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1);
    setIsOpen2(false);
  };

  const toggleCollapse2 = () => {
    setIsOpen2(!isOpen2);
    setIsOpen1(false);
  };

	const closeSidebar = () => {
		dispatch(closeUserSidebar());
	};

	console.log('userSidebar', userSidebar)

  return (
    <React.Fragment>
      <div 
				style={{ display: userSidebar ? "block" : canClose ? "none" : undefined }} 
				className={`${isCurrentUser ? '' : 'user-profile-sidebar'}`}
			>
				<div className="px-3 px-lg-4 pt-3 pt-lg-4">
					<div className="user-chat-nav text-end">
						{canClose && (
							<Button 
								color="none" 
								type="button" 
								onClick={closeSidebar} 
								className="nav-btn" 
								id="user-profile-hide"
							>
							<i className="ri-close-line"></i>
						</Button>
						)}
					</div>
				</div>

				<div className="px-4 pt-4">
					{member?.user.id === currentUser?.id && (
						<>
							<ProfileActionBar />
							<h4 className="mb-0">{t("My Profile")}</h4>
						</>
					)}
				</div>

        <div className="text-center p-4 border-bottom">
          <div className="mb-4">
            {member?.profile_picture_url ? (
              <img
                src={member?.profile_picture_url}
                className="rounded-circle avatar-lg img-thumbnail"
                alt="chatvia"
              />
            ) : (
              <div aria-label='status' className={`avatar-md mx-auto d-block chat-user-img`}>
                <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
								 {member?.display_name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <h5 className="font-size-16 mb-1 text-truncate">
            {member?.display_name}
          </h5>
          <p className="text-muted text-truncate mb-1">
            <i className={`ri-record-circle-fill font-size-10 ${member?.online ? 'text-success' : ''} me-1 d-inline-block`} />
            {member?.online ? t("Active") : t("Offline")}
          </p>
        </div>
        {/* End profile user  */}
        
        {/* Start user-profile-desc */}
        <div className="p-4 user-profile-desc">
          <div id="profile-user-accordion-1" className="custom-accordion">
            <Card className="shadow-none border mb-2">
              {/* import collaps */}
              <CustomCollapse
                title="About"
                iconClass="ri-user-2-line"
                isOpen={isOpen1}
                toggleCollapse={toggleCollapse1}
              >
                <div>
                  <p className="text-muted mb-1">{t("Name")}</p>
                  <h5 className="font-size-14">{member?.display_name}</h5>
                </div>
								{member?.title && (
									<div className="mt-4">
										<p className="text-muted mb-1">{t("Title")}</p>
										<h5 className="font-size-14">{member?.title}</h5>
									</div>
								)}

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Email")}</p>
                  <h5 className="font-size-14">{member?.user.email}</h5>
                </div>

								{member?.status && (
									<div className="mt-4">
										<p className="text-muted mb-1">{t("status")}</p>
										<h5 className="font-size-14">{member?.status}</h5>
									</div>
								)}

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Time")}</p>
                  <h5 className="font-size-14">
										{member ? getCurrentTimeInTimezone(member.user.timezone) : ''} local time
									</h5>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Timezone")}</p>
                  <h5 className="font-size-14 mb-0">{member?.user.timezone}</h5>
                </div>
              </CustomCollapse>
            </Card>
            {/* End About card  */}

            {/* <Card className="mb-1 shadow-none border">
              <CustomCollapse
                title="Attached Files"
                iconClass="ri-attachment-line"
                isOpen={isOpen2}
                toggleCollapse={toggleCollapse2}
              >
                <AttachedFiles files={files} />
              </CustomCollapse>
            </Card> */}

            {/* End Attached Files card  */}
          </div>
          {/* end profile-user-accordion  */}
        </div>
        {/* end user-profile-desc  */}
      </div>
    </React.Fragment>
  );
}

export default Profile;
