import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    UncontrolledTooltip,
    Form,
    Label,
    Input,
    Collapse,
    CardHeader,
    CardBody,
    Alert,
    InputGroup,
    Card,
    Badge
} from 'reactstrap';
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from 'src/redux/hooks';
import { useTranslation } from 'react-i18next';

// SimpleBar
import SimpleBar from "simplebar-react";

// Components
import { SelectContact } from 'src/components';

// Actions
import { createGroup } from 'src/redux/slices/chat';

const Groups = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // Redux state
    const groups = useAppSelector((state) => state.chat.groups);

    // Local state
    const [modal, setModal] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>([]);
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");

    // Toggle modal
    const toggleModal = () => {
        setModal(!modal);
    };

    // Toggle collapse
    const toggleCollapse = () => {
        setIsOpenCollapse(!isOpenCollapse);
    };

    // Handle group creation
    const handleCreateGroup = () => {
        if (selectedContact.length > 2) {
            const newGroup = {
                groupId: groups.length + 1,
                name: `#${groupName}`,
                profilePicture: "Null",
                isGroup: true,
                unRead: 0,
                isNew: true,
                desc: groupDesc,
                members: selectedContact,
            };

            // Dispatch create group action
            dispatch(createGroup(newGroup));
            toggleModal();
        } else if (selectedContact.length === 1) {
            setMessage("Minimum 2 members required!!!");
            setIsOpenAlert(true);
        } else {
            setMessage("Please Select Members!!!");
            setIsOpenAlert(true);
        }

        setTimeout(() => setIsOpenAlert(false), 3000);
    };

    // Handle contact selection
    const handleCheck = (e:any, contactId:any) => {
        if (e.target.checked) {
            setSelectedContact((prev:any) => [
                ...prev,
                { id: contactId, name: e.target.value },
            ]);
        }
    };

    return (
        <React.Fragment>
            <div>
                <div className="p-4">
                    <div className="user-chat-nav float-end">
                        <div id="create-group">
                            {/* Button trigger modal */}
                            <Button
                                onClick={toggleModal}
                                type="button"
                                color="link"
                                className="text-decoration-none text-muted font-size-18 py-0"
                            >
                                <i className="ri-group-line me-1"></i>
                            </Button>
                        </div>
                        <UncontrolledTooltip target="create-group" placement="bottom">
                            Create group
                        </UncontrolledTooltip>
                    </div>
                    <h4 className="mb-4">{t('Groups')}</h4>

                    {/* Start add group Modal */}
                    <Modal isOpen={modal} centered toggle={toggleModal}>
                        <ModalHeader
                            tag="h5"
                            className="modal-title font-size-14"
                            toggle={toggleModal}
                        >
                            {t('Create New Group')}
                        </ModalHeader>
                        <ModalBody className="p-4">
                            <Form>
                                <div className="mb-4">
                                    <Label
                                        className="form-label"
                                        htmlFor="addgroupname-input"
                                    >
                                        {t('Group Name')}
                                    </Label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="addgroupname-input"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Enter Group Name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label className="form-label">{t('Group Members')}</Label>
                                    <Alert isOpen={isOpenAlert} color="danger">
                                        {message}
                                    </Alert>
                                    <div className="mb-3">
                                        <Button
                                            color="light"
                                            size="sm"
                                            type="button"
                                            onClick={toggleCollapse}
                                        >
                                            {t('Select Members')}
                                        </Button>
                                    </div>

                                    <Collapse isOpen={isOpenCollapse} id="groupmembercollapse">
                                        <Card className="border">
                                            <CardHeader>
                                                <h5 className="font-size-15 mb-0">
                                                    {t('Contacts')}
                                                </h5>
                                            </CardHeader>
                                            <CardBody className="p-2">
                                                <SimpleBar style={{ maxHeight: "150px" }}>
                                                    {/* Contacts */}
                                                    <div id="addContacts">
                                                        <SelectContact
                                                            handleCheck={handleCheck}
                                                        />
                                                    </div>
                                                </SimpleBar>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </div>
                                <div>
                                    <Label
                                        className="form-label"
                                        htmlFor="addgroupdescription-input"
                                    >
                                        {t('Description')}
                                    </Label>
                                    <textarea
                                        className="form-control"
                                        id="addgroupdescription-input"
                                        value={groupDesc}
                                        onChange={(e) => setGroupDesc(e.target.value)}
                                        rows={3}
                                        placeholder="Enter Description"
                                    ></textarea>
                                </div>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" color="link" onClick={toggleModal}>
                                {t('Close')}
                            </Button>
                            <Button type="button" color="primary" onClick={handleCreateGroup}>
                                Create Group
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {/* End add group Modal */}

                    <div className="search-box chat-search-box">
                        <InputGroup size="lg" className="bg-light rounded-lg">
                            <Button
                                color="link"
                                className="text-decoration-none text-muted pr-1"
                                type="button"
                            >
                                <i className="ri-search-line search-icon font-size-18"></i>
                            </Button>
                            <Input
                                type="text"
                                className="form-control bg-light"
                                placeholder="Search groups..."
                            />
                        </InputGroup>
                    </div>
                </div>

                {/* Start chat-group-list */}
                <SimpleBar
                    style={{ maxHeight: "100%" }}
                    className="p-4 chat-message-list chat-group-list"
                >
                    <ul className="list-unstyled chat-list">
                        {groups.map((group, key) => (
                            <li key={key}>
                                <Link to="#">
                                    <div className="d-flex align-items-center">
                                        <div className="chat-user-img me-3 ms-0">
                                            <div className="avatar-xs">
                                                <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                    {group.name.charAt(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="text-truncate font-size-14 mb-0">
                                                {group.name}
                                                {group.unRead !== 0 && (
                                                    <Badge
                                                        color="none"
                                                        pill
                                                        className="badge-soft-danger float-end"
                                                    >
                                                        {group.unRead >= 20
                                                            ? `${group.unRead}+`
                                                            : group.unRead}
                                                    </Badge>
                                                )}
                                                {group.isNew && (
                                                    <Badge
                                                        color="none"
                                                        pill
                                                        className="badge-soft-danger float-end"
                                                    >
                                                        New
                                                    </Badge>
                                                )}
                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </SimpleBar>
            </div>
        </React.Fragment>
    );
};

export default Groups;
