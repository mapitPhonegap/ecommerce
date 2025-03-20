import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import supabase from "@/services/supabase";
import { setContact } from "../redux/actions/contactAction"; // Import your Redux action

const useContact = (tagId) => {
  const dispatch = useDispatch();
  const contact = useSelector((state) => state.contact);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      if (!tagId || contact?.name) return;
      setLoading(true);
      setError(null); // Reset error state
      try {
        const data = await supabase.getNfcContact(tagId);
        dispatch(setContact({
          ...data
        }));
      } catch (err) {
        setError(err.message || "Failed to fetch contact");
      } finally {
        setLoading(false);
      }
      };
    fetchContact();
  }, [tagId, dispatch, contact]);   
  return { contact, loading, error };
};

export default useContact;