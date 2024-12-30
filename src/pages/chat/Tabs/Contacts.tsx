import React, { useState, useEffect } from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    UncontrolledTooltip,
    Form,
    Label,
    Input,
    InputGroup,
} from 'reactstrap';
import SimpleBar from "simplebar-react";

import { useAppSelector } from 'src/redux/hooks';
import { useTranslation } from 'react-i18next';

const Contacts = () => {
    const { t } = useTranslation();

    // Fetch contacts from Redux store using useSelector
    const contactsFromStore = useAppSelector((state) => state.chat.contacts);

    const [modal, setModal] = useState(false);
    const [sortedContacts, setSortedContacts] = useState<any>([]);

    // Toggles the modal state
    const toggleModal = () => {
        setModal((prevModal) => !prevModal);
    };

    // Sort contacts alphabetically
    const sortContacts = (contacts:any) => {
        const sorted = contacts.reduce((acc:any, contact:any) => {
            try {
                // Group by the first letter of the name
                const group = contact.name[0].toUpperCase();
                if (!acc[group]) acc[group] = { group, children: [contact] };
                else acc[group].children.push(contact);
            } catch (error) {
                return [];
            }
            return acc;
        }, {});

        return Object.values(sorted);
    };

    // Re-sort contacts when `contactsFromStore` updates
    useEffect(() => {
        if (contactsFromStore) {
            const sorted = sortContacts(contactsFromStore);
            setSortedContacts(sorted);
        }
    }, [contactsFromStore]);

    return (
        <React.Fragment>
            <div>
                <div className="p-4">
                    <div className="user-chat-nav float-end">
                        <div id="add-contact">
                            {/* Button trigger modal */}
                            <Button
                                type="button"
                                color="link"
                                onClick={toggleModal}
                                className="text-decoration-none text-muted font-size-18 py-0"
                            >
                                <i className="ri-user-add-line"></i>
                            </Button>
                        </div>
                        <UncontrolledTooltip target="add-contact" placement="bottom">
                            {t('Add Contact')}
                        </UncontrolledTooltip>
                    </div>
                    <h4 className="mb-4">{t('Contacts')}</h4>

                    {/* Add Contact Modal */}
                    <Modal isOpen={modal} centered toggle={toggleModal}>
                        <ModalHeader
                            tag="h5"
                            className="font-size-16"
                            toggle={toggleModal}
                        >
                            {t('Add Contacts')}
                        </ModalHeader>
                        <ModalBody className="p-4">
                            <Form>
                                <div className="mb-4">
                                    <Label
                                        className="form-label"
                                        htmlFor="addcontactemail-input"
                                    >
                                        {t('Email')}
                                    </Label>
                                    <Input
                                        type="email"
                                        className="form-control"
                                        id="addcontactemail-input"
                                        placeholder={t('Enter Email')}
                                    />
                                </div>
                                <div>
                                    <Label
                                        className="form-label"
                                        htmlFor="addcontact-invitemessage-input"
                                    >
                                        {t('Invitation Message')}
                                    </Label>
                                    <textarea
                                        className="form-control"
                                        id="addcontact-invitemessage-input"
                                        rows={3}
                                        placeholder={t('Enter Message')}
                                    ></textarea>
                                </div>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" color="link" onClick={toggleModal}>
                                {t('Close')}
                            </Button>
                            <Button type="button" color="primary">
                                {t('Invite Contact')}
                            </Button>
                        </ModalFooter>
                    </Modal>

                    {/* Search Box */}
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
                                placeholder={t('Search users..')}
                            />
                        </InputGroup>
                    </div>
                </div>

                {/* Contact List */}
                <SimpleBar
                    style={{ maxHeight: "100%" }}
                    id="chat-room"
                    className="p-4 chat-message-list chat-group-list"
                >
                    {sortedContacts.map((contact:any, index:number) => (
                        <div key={index} className={index === 0 ? "" : "mt-3"}>
                            <div className="p-3 fw-bold text-primary">
                                {contact.group}
                            </div>
                            <ul className="list-unstyled contact-list">
                                {contact.children.map((child:any, childIndex:number) => (
                                    <li key={childIndex}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 className="font-size-14 m-0">{child.name}</h5>
                                            </div>
                                            <UncontrolledDropdown>
                                                <DropdownToggle tag="a" className="text-muted">
                                                    <i className="ri-more-2-fill"></i>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-end">
                                                    <DropdownItem>
                                                        {t('Share')}{' '}
                                                        <i className="ri-share-line float-end text-muted"></i>
                                                    </DropdownItem>
                                                    <DropdownItem>
                                                        {t('Block')}{' '}
                                                        <i className="ri-forbid-line float-end text-muted"></i>
                                                    </DropdownItem>
                                                    <DropdownItem>
                                                        {t('Remove')}{' '}
                                                        <i className="ri-delete-bin-line float-end text-muted"></i>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </SimpleBar>
            </div>
        </React.Fragment>
    );
};

export default Contacts;
