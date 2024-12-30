import React, { useState } from "react";
import { Button, Card, Badge } from "reactstrap";

// Simple bar
import SimpleBar from "simplebar-react";

import { useAppSelector, useAppDispatch } from 'src/redux/hooks';

// Components
import { AttachedFiles } from 'src/components';
import CustomCollapse from "./components/CustomCollapse";

// Actions
import { closeUserSidebar } from 'src/redux/slices/layout';

// i18n
import { useTranslation } from "react-i18next";

// Image
import avatar7 from "src/assets/images/users/avatar-7.jpg";


type UserProfileSidebarProps = {
    activeUser: any
}

const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({ activeUser }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    // Redux state
    const users = useAppSelector((state) => state.chat.users);
    const userSidebar = useAppSelector((state) => state.layout.userSidebar);

    // Local state
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);

    const [files] = useState([
        { name: "Admin-A.zip", size: "12.5 MB", thumbnail: "ri-file-text-fill" },
        { name: "Image-1.jpg", size: "4.2 MB", thumbnail: "ri-image-fill" },
        { name: "Image-2.jpg", size: "3.1 MB", thumbnail: "ri-image-fill" },
        { name: "Landing-A.zip", size: "6.7 MB", thumbnail: "ri-file-text-fill" },
    ]);

    // Collapse toggles
    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
    };

    const toggleCollapse3 = () => {
        setIsOpen3(!isOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
    };

    // Close sidebar
    const closeSidebar = () => {
        dispatch(closeUserSidebar());
    };

    return (
        <React.Fragment>
            <div style={{ display: userSidebar ? "block" : "none" }} className="user-profile-sidebar">
                <div className="px-3 px-lg-4 pt-3 pt-lg-4">
                    <div className="user-chat-nav text-end">
                        <Button color="none" type="button" onClick={closeSidebar} className="nav-btn" id="user-profile-hide">
                            <i className="ri-close-line"></i>
                        </Button>
                    </div>
                </div>

                <div className="text-center p-4 border-bottom">
                    <div className="mb-4 d-flex justify-content-center">
                        {activeUser.profilePicture === "Null" ? (
                            <div className="avatar-lg">
                                <span className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-24">
                                    {activeUser.name.charAt(0)}
                                </span>
                            </div>
                        ) : (
                            <img
                                src={activeUser.profilePicture}
                                className="rounded-circle avatar-lg img-thumbnail"
                                alt="chatvia"
                            />
                        )}
                    </div>

                    <h5 className="font-size-16 mb-1 text-truncate">{activeUser.name}</h5>
                    <p className="text-muted text-truncate mb-1">
                        {(() => {
                            switch (activeUser.status) {
                                case "online":
                                    return <i className="ri-record-circle-fill font-size-10 text-success me-1"></i>;
                                case "away":
                                    return <i className="ri-record-circle-fill font-size-10 text-warning me-1"></i>;
                                case "offline":
                                    return <i className="ri-record-circle-fill font-size-10 text-secondary me-1"></i>;
                                default:
                                    return null;
                            }
                        })()}
                        Active
                    </p>
                </div>

                {/* User Profile Description */}
                <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">
                    <div className="text-muted">
                        <p className="mb-4">
                            "{t(
                                "If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual."
                            )}"
                        </p>
                    </div>

                    <div id="profile-user-accordion" className="custom-accordion">
                        {/* About Section */}
                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="About"
                                iconClass="ri-user-2-line"
                                isOpen={isOpen1}
                                toggleCollapse={toggleCollapse1}
                            >
                                <div>
                                    <p className="text-muted mb-1">{t("Name")}</p>
                                    <h5 className="font-size-14">{activeUser.name}</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t("Email")}</p>
                                    <h5 className="font-size-14">{activeUser.email}</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t("Time")}</p>
                                    <h5 className="font-size-14">11:40 AM</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t("Location")}</p>
                                    <h5 className="font-size-14 mb-0">California, USA</h5>
                                </div>
                            </CustomCollapse>
                        </Card>

                        {/* Attached Files Section */}
                        <Card className="mb-1 shadow-none border">
                            <CustomCollapse
                                title="Attached Files"
                                iconClass="ri-attachment-line"
                                isOpen={isOpen2}
                                toggleCollapse={toggleCollapse2}
                            >
                                <AttachedFiles files={files} />
                            </CustomCollapse>
                        </Card>

                        {/* Members Section (if group) */}
                        {activeUser.isGroup && (
                            <Card className="mb-1 shadow-none border">
                                <CustomCollapse
                                    title="Members"
                                    iconClass="ri-group-line"
                                    isOpen={isOpen3}
                                    toggleCollapse={toggleCollapse3}
                                >
                                    <Card className="p-2 mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="align-self-center me-3">
                                                <div className="avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                        S
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="font-size-14 mb-1">
                                                    {t("Sera Mullar")}
                                                    <Badge color="danger" className="badge-soft-danger float-end">
                                                        {t("Admin")}
                                                    </Badge>
                                                </h5>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-2 mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="align-self-center me-3">
                                                <div className="avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                        O
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="font-size-14 mb-1">{t("Ossie Wilson")}</h5>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-2 mb-2">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={avatar7}
                                                className="rounded-circle chat-user-img avatar-xs me-3"
                                                alt="chatvia"
                                            />
                                            <div>
                                                <h5 className="font-size-14 mb-1">{t("Paul Haynes")}</h5>
                                            </div>
                                        </div>
                                    </Card>
                                </CustomCollapse>
                            </Card>
                        )}
                    </div>
                </SimpleBar>
            </div>
        </React.Fragment>
    );
};

export default UserProfileSidebar;
