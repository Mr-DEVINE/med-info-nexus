
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/context/UserContext";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  username: string | null;
  email: string;
  role: UserRole;
  created_at: string;
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
        created_at: profile.created_at
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
