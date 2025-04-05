
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodInventory {
  blood_type: BloodType;
  units_available: number;
  last_updated: string;
}

export interface DonationRequest {
  id: string;
  requester_id: string;
  blood_type: BloodType;
  units_needed: number;
  reason: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'fulfilled' | 'canceled';
  created_at: string;
  requester_name?: string;
}

export interface BloodDonation {
  id: string;
  donor_id: string;
  blood_type: BloodType;
  units: number;
  donation_date: string;
  status: 'pending' | 'completed' | 'rejected';
  donation_center: string;
  notes: string | null;
}

export async function fetchBloodInventory(): Promise<BloodInventory[]> {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching blood inventory:", error);
    toast.error("Failed to load blood inventory");
    return [];
  }
}

export async function fetchDonationRequests(): Promise<DonationRequest[]> {
  try {
    const { data, error } = await supabase
      .from('donation_requests')
      .select(`
        *,
        profiles:requester_id (username)
      `)
      .eq('status', 'open')
      .order('urgency', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      requester_name: item.profiles?.username || 'Unknown'
    })) || [];
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    toast.error("Failed to load donation requests");
    return [];
  }
}

export async function createDonationRequest(
  request: Omit<DonationRequest, 'id' | 'created_at'>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('donation_requests')
      .insert(request)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success("Blood donation request created successfully");
    return data.id;
  } catch (error) {
    console.error("Error creating donation request:", error);
    toast.error("Failed to create donation request");
    return null;
  }
}

export async function scheduleBloodDonation(
  donation: Omit<BloodDonation, 'id'>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('blood_donations')
      .insert(donation)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success("Blood donation scheduled successfully");
    return data.id;
  } catch (error) {
    console.error("Error scheduling blood donation:", error);
    toast.error("Failed to schedule blood donation");
    return null;
  }
}

export async function fetchUserDonations(userId: string): Promise<BloodDonation[]> {
  try {
    const { data, error } = await supabase
      .from('blood_donations')
      .select('*')
      .eq('donor_id', userId)
      .order('donation_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching user donations:", error);
    toast.error("Failed to load donation history");
    return [];
  }
}
