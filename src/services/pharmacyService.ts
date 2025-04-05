
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Medication {
  id: string;
  name: string;
  description: string;
  dosage: string;
  price: number;
  in_stock: boolean;
  requires_prescription: boolean;
  image_url: string | null;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medication_id: string;
  dosage: string;
  instructions: string;
  start_date: string;
  end_date: string | null;
  refills: number;
  status: 'active' | 'completed' | 'canceled';
  created_at: string;
  medication?: Medication;
}

export interface MedicationOrder {
  id: string;
  patient_id: string;
  medication_id: string;
  prescription_id: string | null;
  quantity: number;
  status: 'pending' | 'processed' | 'shipped' | 'delivered' | 'canceled';
  created_at: string;
  medication?: Medication;
}

export async function fetchMedications(searchQuery?: string): Promise<Medication[]> {
  try {
    let query = supabase.from('medications').select('*');
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching medications:", error);
    toast.error("Failed to load medications");
    return [];
  }
}

export async function fetchUserPrescriptions(userId: string): Promise<Prescription[]> {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        medication:medication_id (*)
      `)
      .eq('patient_id', userId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    toast.error("Failed to load prescriptions");
    return [];
  }
}

export async function createMedicationOrder(
  order: Omit<MedicationOrder, 'id' | 'created_at'>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('medication_orders')
      .insert(order)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success("Medication order placed successfully");
    return data.id;
  } catch (error) {
    console.error("Error creating medication order:", error);
    toast.error("Failed to place medication order");
    return null;
  }
}

export async function fetchUserMedicationOrders(userId: string): Promise<MedicationOrder[]> {
  try {
    const { data, error } = await supabase
      .from('medication_orders')
      .select(`
        *,
        medication:medication_id (*)
      `)
      .eq('patient_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching medication orders:", error);
    toast.error("Failed to load medication orders");
    return [];
  }
}
