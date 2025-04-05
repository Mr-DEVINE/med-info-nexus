
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/context/UserContext";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  username: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  full_name?: string | null;
  specialty?: string | null;
  bio?: string | null;
  blood_type?: string | null;
  date_of_birth?: string | null;
  phone_number?: string | null;
  address?: string | null;
  emergency_contact?: string | null;
}

export const fetchAllUsers = async (): Promise<UserProfile[]> => {
  try {
    // Get all users from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      throw profilesError;
    }

    // Get all users from auth to get their emails
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    // Ensure authUsers.users exists and is an array
    if (!authUsers?.users || !Array.isArray(authUsers.users)) {
      console.error("Auth users data is not in expected format:", authUsers);
      return [];
    }

    // Combine the data
    const users = profiles.map(profile => {
      const authUser = authUsers.users.find(u => u.id === profile.id);
      return {
        id: profile.id,
        username: profile.username,
        email: authUser?.email || 'Unknown',
        role: profile.role as UserRole,
        created_at: profile.created_at,
        full_name: profile.full_name,
        specialty: profile.specialty,
        bio: profile.bio
      };
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to fetch users");
    return [];
  }
};

export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    toast.success(`User role updated to ${role}`);
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    toast.error("Failed to update user role");
    return false;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // First delete from auth (this should cascade to profiles)
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw error;
    }

    toast.success("User deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user");
    return false;
  }
};

export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<Omit<UserProfile, 'id' | 'email' | 'role' | 'created_at'>>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq("id", userId);

    if (error) {
      throw error;
    }

    toast.success("Profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to update profile");
    return false;
  }
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Get auth user data for email
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);

    if (authError) {
      throw authError;
    }

    if (!profile || !authUser.user) {
      return null;
    }

    return {
      id: profile.id,
      username: profile.username,
      email: authUser.user.email || 'Unknown',
      role: profile.role as UserRole,
      created_at: profile.created_at,
      full_name: profile.full_name,
      specialty: profile.specialty,
      bio: profile.bio,
      blood_type: profile.blood_type,
      date_of_birth: profile.date_of_birth,
      phone_number: profile.phone_number,
      address: profile.address,
      emergency_contact: profile.emergency_contact
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error("Failed to fetch user profile");
    return null;
  }
};

export const searchUsers = async (
  query: string, 
  role?: UserRole
): Promise<UserProfile[]> => {
  try {
    let dbQuery = supabase
      .from('profiles')
      .select('*');
    
    // Add filter by role if specified
    if (role) {
      dbQuery = dbQuery.eq('role', role);
    }
    
    // Add search query
    dbQuery = dbQuery.or(`username.ilike.%${query}%,full_name.ilike.%${query}%`);
    
    const { data: profiles, error } = await dbQuery;

    if (error) {
      throw error;
    }

    // We can't join with auth to get emails here due to security restrictions,
    // so we'll return partial profiles
    return profiles.map(profile => ({
      id: profile.id,
      username: profile.username,
      email: '', // We don't have this without extra auth calls
      role: profile.role as UserRole,
      created_at: profile.created_at,
      full_name: profile.full_name,
      specialty: profile.specialty,
      bio: profile.bio
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    toast.error("Failed to search users");
    return [];
  }
};
