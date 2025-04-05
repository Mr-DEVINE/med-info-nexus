
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MedicalRecord {
  id: string;
  patient_id: string;
  created_by_id: string;
  record_date: string;
  record_type: 'general' | 'diagnosis' | 'test' | 'treatment' | 'note';
  title: string;
  description: string;
  attachments: string[] | null;
  created_at: string;
}

export interface Diagnosis {
  id: string;
  patient_id: string;
  doctor_id: string;
  condition: string;
  description: string;
  date_diagnosed: string;
  status: 'active' | 'monitoring' | 'resolved' | 'chronic';
  treatment_plan: string | null;
  created_at: string;
}

export async function fetchPatientMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('record_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching medical records:", error);
    toast.error("Failed to load medical records");
    return [];
  }
}

export async function createMedicalRecord(
  record: Omit<MedicalRecord, 'id' | 'created_at'>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .insert(record)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success("Medical record created successfully");
    return data.id;
  } catch (error) {
    console.error("Error creating medical record:", error);
    toast.error("Failed to create medical record");
    return null;
  }
}

export async function fetchPatientDiagnoses(patientId: string): Promise<Diagnosis[]> {
  try {
    const { data, error } = await supabase
      .from('diagnoses')
      .select(`
        *,
        doctor:doctor_id (username)
      `)
      .eq('patient_id', patientId)
      .order('date_diagnosed', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    toast.error("Failed to load diagnoses");
    return [];
  }
}

export async function createDiagnosis(
  diagnosis: Omit<Diagnosis, 'id' | 'created_at'>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('diagnoses')
      .insert(diagnosis)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success("Diagnosis record created successfully");
    return data.id;
  } catch (error) {
    console.error("Error creating diagnosis:", error);
    toast.error("Failed to create diagnosis record");
    return null;
  }
}

export async function updateMedicalRecord(
  id: string, 
  updates: Partial<MedicalRecord>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('medical_records')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success("Medical record updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating medical record:", error);
    toast.error("Failed to update medical record");
    return false;
  }
}
