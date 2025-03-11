import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import supabase from "@/services/supabase";
import { setContact } from "../redux/actions/contactAction"; // Import your Redux action

const useContact = (tagId) => {
  const dispatch = useDispatch();
  const contact = useSelector((state) => state.contact?.[tagId] || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      if (!tagId) return;

      const data = await supabase.getNfcContact(tagId);
      console.log(data);
      if (data) {
        dispatch(setContact({ tagId, contact: {
          ...data,
          profilePicture: data.users?.avatar_url,
          name: data.users?.name || data.name,
        }}));
      }
      setLoading(false);
    };

    fetchContact();
  }, [tagId, dispatch]);

  return { contact, loading };
};

export default useContact;