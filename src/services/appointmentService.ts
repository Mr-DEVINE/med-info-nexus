
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'canceled';
  reason: string;
  notes: string | null;
  created_at: string;
}

export interface AppointmentWithDoctor extends Appointment {
  doctor_name: string | null;
  doctor_specialty: string | null;
}

export async function fetchUserAppointments(userId: string): Promise<AppointmentWithDoctor[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctor_id (
          username,
          specialty
        )
      `)
      .eq('patient_id', userId)
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      doctor_name: item.doctor?.username || null,
      doctor_specialty: item.doctor?.specialty || null
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("Failed to load appointments");
    return [];
  }
}

export async function createAppointment(
  appointmentData: Omit<Appointment, 'id' | 'created_at'>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success("Appointment scheduled successfully");
    return data.id;
  } catch (error) {
    console.error("Error creating appointment:", error);
    toast.error("Failed to schedule appointment");
    return null;
  }
}

export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success("Appointment updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("Failed to update appointment");
    return false;
  }
}

export async function cancelAppointment(id: string): Promise<boolean> {
  return updateAppointment(id, { status: 'canceled' });
}

export async function fetchAvailableDoctors(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, specialty')
      .eq('role', 'doctor');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    toast.error("Failed to load doctors");
    return [];
  }
}
