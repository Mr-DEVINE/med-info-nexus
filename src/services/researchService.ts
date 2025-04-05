
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ResearchStudy {
  id: string;
  title: string;
  description: string;
  researcher_id: string;
  status: 'recruiting' | 'active' | 'completed' | 'discontinued';
  start_date: string;
  end_date: string | null;
  eligibility_criteria: string;
  max_participants: number;
  current_participants: number;
  created_at: string;
  researcher_name?: string;
}

export interface StudyParticipation {
  id: string;
  study_id: string;
  patient_id: string;
  enrollment_date: string;
  status: 'enrolled' | 'active' | 'completed' | 'withdrawn';
  notes: string | null;
  study?: ResearchStudy;
}

export async function fetchActiveStudies(): Promise<ResearchStudy[]> {
  try {
    const { data, error } = await supabase
      .from('research_studies')
      .select(`
        *,
        profiles:researcher_id (username)
      `)
      .in('status', ['recruiting', 'active'])
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      researcher_name: item.profiles?.username || 'Unknown'
    })) || [];
  } catch (error) {
    console.error("Error fetching active studies:", error);
    toast.error("Failed to load research studies");
    return [];
  }
}

export async function createResearchStudy(
  study: Omit<ResearchStudy, 'id' | 'created_at' | 'current_participants'>
): Promise<string | null> {
  try {
    const studyWithParticipants = {
      ...study,
      current_participants: 0
    };
    
    const { data, error } = await supabase
      .from('research_studies')
      .insert(studyWithParticipants)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    toast.success("Research study created successfully");
    return data.id;
  } catch (error) {
    console.error("Error creating research study:", error);
    toast.error("Failed to create research study");
    return null;
  }
}

export async function enrollInStudy(
  studyId: string,
  patientId: string
): Promise<string | null> {
  try {
    // Start a transaction - first create participation record
    const { data, error } = await supabase
      .from('study_participations')
      .insert({
        study_id: studyId,
        patient_id: patientId,
        enrollment_date: new Date().toISOString(),
        status: 'enrolled'
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    // Then increment the participant count
    const { error: updateError } = await supabase.rpc(
      'increment_study_participants',
      { study_id: studyId }
    );

    if (updateError) {
      throw updateError;
    }

    toast.success("Successfully enrolled in research study");
    return data.id;
  } catch (error) {
    console.error("Error enrolling in study:", error);
    toast.error("Failed to enroll in research study");
    return null;
  }
}

export async function fetchUserStudyParticipations(userId: string): Promise<StudyParticipation[]> {
  try {
    const { data, error } = await supabase
      .from('study_participations')
      .select(`
        *,
        study:study_id (*)
      `)
      .eq('patient_id', userId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching study participations:", error);
    toast.error("Failed to load research participation data");
    return [];
  }
}

export async function fetchResearcherStudies(researcherId: string): Promise<ResearchStudy[]> {
  try {
    const { data, error } = await supabase
      .from('research_studies')
      .select('*')
      .eq('researcher_id', researcherId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching researcher studies:", error);
    toast.error("Failed to load research studies");
    return [];
  }
}
