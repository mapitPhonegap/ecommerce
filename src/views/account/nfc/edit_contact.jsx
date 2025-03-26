import React from "react";
import { useSelector } from "react-redux";
import {ContactCard} from "@/components/common"; // Import the new component

const ContactPage = () => {
  const contact = useSelector((state) => state.profile);

  return (
    <div className="account-contact-page min-h-screen flex flex-col items-center justify-center bg-base-200">
      <ContactCard contact={contact} isEdit={true} />
    </div>
  );
};

export default ContactPage;
