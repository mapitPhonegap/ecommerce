import { useParams } from "react-router-dom";
import useContact from "@/hooks/useContact";
import { ContactCard } from "@/components/common";

const ContactPage = () => {
  const { id } = useParams();
  const { contact, loading, error } = useContact(id);
return (
      <ContactCard contact={contact} />
  );
  
};

export default ContactPage;
