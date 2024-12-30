import React, { useEffect, useState } from 'react';
import { Input, Label } from "reactstrap";
import { useAppSelector } from 'src/redux/hooks';


type SelectContactProps = {
    handleCheck: any;
}

const SelectContact: React.FC<SelectContactProps> = ({ handleCheck }:any) => {
    // Redux state
    const contacts = useAppSelector((state) => state.chat.contacts);

    // Local state
    const [sortedContacts, setSortedContacts] = useState<any>([
        {
            group: "A",
            children: [{ id: 0, name: "Demo" }]
        }
    ]);

    // Function to sort contacts alphabetically by the first letter of their name
    const sortContacts = (contactsList:any) => {
        let data = contactsList.reduce((acc:any, contact:any) => {
            try {
                // Get the first letter of the name
                let group = contact.name[0].toUpperCase();
                // Initialize group if it doesn't exist
                if (!acc[group]) {
                    acc[group] = { group, children: [contact] };
                } else {
                    // Add contact to the existing group
                    acc[group].children.push(contact);
                }
            } catch (error) {
                console.error("Error sorting contacts:", error);
                return acc;
            }
            return acc;
        }, {});

        // Convert the object to an array
        return Object.values(data).sort((a:any, b:any) => a.group.localeCompare(b.group));
    };

    // Sort contacts when the component mounts or when `contacts` changes
    useEffect(() => {
        const sorted = sortContacts(contacts);
        setSortedContacts(sorted);
    }, [contacts]);

    return (
        <React.Fragment>
            {sortedContacts.map((contactGroup:any, key:number) => (
                <div key={key}>
                    <div className="p-3 font-weight-bold text-primary">
                        {contactGroup.group}
                    </div>
                    <ul className="list-unstyled contact-list">
                        {contactGroup.children.map((child:any, childKey:number) => (
                            <li key={childKey}>
                                <div className="form-check">
                                    <Input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) => handleCheck(e, child.id)}
                                        id={`memberCheck${child.id}`}
                                        value={child.name}
                                    />
                                    <Label
                                        className="form-check-label"
                                        htmlFor={`memberCheck${child.id}`}
                                    >
                                        {child.name}
                                    </Label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </React.Fragment>
    );
};

export default SelectContact;
