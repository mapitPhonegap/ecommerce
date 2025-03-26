import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

class SupabaseService {
  constructor() {
    this.supabase = createClient(supabaseConfig.supabaseURL, supabaseConfig.anonKey, {
      auth: {
        persistSession: true,  
        storage: localStorage, 
      }
    });
    this.auth = this.supabase.auth;
    this.db = this.supabase; // Supabase uses SQL-based queries
  }
  
  // AUTH ACTIONS ------------

  createAccount = async (email, password) => {
    const { data, error } = await this.auth.signUp({ email, password });
    
    console.log("Signup response:", data, error); // Debugging output
  
    if (error) {
      console.error("Signup error:", error);
      throw error;
    }
  
    return data.user; // Ensure this returns the correct user object
  };
  



  signInWithGoogle = async () => {
    return this.auth.signInWithOAuth({ provider: 'google' });
  };

  signInWithFacebook= async () => {
    return this.auth.signInWithOAuth({ provider: 'facebook' });
  };
  signInWithGithub= async () => {
    return this.auth.signInWithOAuth({ provider: 'github' });
  };

  passwordReset= async (email) => {
    return this.auth.resetPasswordForEmail(email);
  };

  getNfcContact = async (id) => {
    const { data, error } = await this.db.from("nfc_tags").select("*, users(avatar, fullname, email, video, bio, mobile, facebook, instagram, website, title, work, work_address, note, theme)").eq("id", id).limit(1).maybeSingle();
    if (error) {
      console.error("Error fetching nfc contact data:", error.message);
      return null;
    }
  
    if (!data) {
      console.error("Nfc contact not found");
      return null;
    }
  
    return data;
  };

  getSingleUser = async (id) => {
    const { data, error } = await this.db.from("users").select("*").eq("id", id).single();
    
    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  
    if (!data) {
      console.error("User not found");
      return null;
    }
  
    return data;
  };
  
  getUser = async () => {
    const { data: authUser, error: authError } = await this.auth.getUser();
  
    if (authError || !authUser?.user) {
      console.error("Error fetching auth user:", authError);
      return null;
    }
  
    const customUser = await this.getSingleUser(authUser.user.id);
    return { ...authUser.user, ...customUser };  // 🔥 Merging user data correctly
  };
  
  addUser = async (userData) => {
    if (!userData || typeof userData !== 'object') {
        console.error("addUser: userData is invalid:", userData);
        throw new Error("Invalid user data");
    }
    
    console.log("addUser: inserting userData ->", userData);
    
    const { data, error } = await this.db
        .from('users')
        .insert([userData])
        .select("*");  // ✅ Ensure data is returned
    
    if (error) {
        console.error("addUser: Supabase insert error ->", error);
        throw error;
    }

    console.log("addUser: Insert success ->", data);
    return data;  // ✅ Ensure data is returned
};

  signIn = async (email, password) => {
    const { user, error } = await this.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
  };

  signOut = async () => {
    const { error } = await this.auth.signOut();
    if (error) throw error;
  };

  passwordReset = async (email) => {
    const { error } = await this.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  updateProfile = async (id, updates) => {
    await this.auth.getSession();

    const { data, error } = await this.db.from("users").update(updates).eq("id", id).select("*").maybeSingle()
      .throwOnError(); // Forces error throwing if something is wrong; // Forces re-fetch
    if (error) {
      console.error("Supabase update error:", error);
      throw error;  // Ensure error is handled in the saga
    }
  
    return data; // Return updated data
  };

  onAuthStateChanged = (callback) => {
    this.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  };

  // PRODUCT ACTIONS --------------

  getSingleProduct = async (id) => {
    const { data, error } = await this.db.from("products").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  };

  getProducts = async (lastRefKey) => {
    let query = this.db
      .from("products")
      .select("*", { count: "exact" }) // Fetch products + total count
      .order("id")
      .limit(12);

    if (lastRefKey) {
      query = query.gt("id", lastRefKey);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return {
      items: data, // The product array (max 12 items)
      total: count, // The total number of products
    };
  };

  searchProducts = async (searchKey) => {
    const { data, count, error } = await this.db
      .from("products")
      .select("*", { count: "exact" }) // Fetch products + total count
      .ilike("name", `%${searchKey}%`)
      .limit(12);

    if (error) throw error;
    return {items: data, // The product array (max 12 items)
      total: count
    };
  };

  getFeaturedProducts = async (itemsCount = 12) => {
    const { data, error } = await this.db
      .from("products")
      .select("*")
      .eq("isFeatured", true)
      .limit(itemsCount);

    if (error) throw error;
    return data;
  };

  getRecommendedProducts = async (itemsCount = 12) => {
    const { data, error } = await this.db
      .from("products")
      .select("*")
      .eq("isRecommended", true)
      .limit(itemsCount);

    if (error) throw error;
    return data;
  };

  addProduct = async (product) => {
    const { data, error } = await this.db.from("products").insert([...product]);
    if (error) throw error;
    return data;
  };

  editProduct = async (id, updates) => {
    const { data, error } = await this.db.from("products").update(updates).eq("id", id);
    if (error) throw error;
    return data;
  };

  removeProduct = async (id) => {
    const { error } = await this.db.from("products").delete().eq("id", id);
    if (error) throw error;
  };

  // STORAGE ACTIONS ------------

  storeImage = async (folder, filePath, file) => {
    const { data, error } = await this.supabase.storage
      .from(folder)
      .upload(filePath, file, { upsert: true });

    if (error) throw error;
    return data.path;
  };

  deleteImage = async (folder, filePath) => {
    const { error } = await this.supabase.storage.from(folder).remove([filePath]);
    if (error) throw error;
  };


  getPublicUrl = async (folder, filePath) => {
    const { data: publicUrlData } = this.supabase.storage.from(folder).getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
}
const supabaseInstance = new SupabaseService();
export default supabaseInstance;
