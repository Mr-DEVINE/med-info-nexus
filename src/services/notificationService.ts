
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Notification {
  id: string;
  user_id: string;
  type: 'appointment' | 'prescription' | 'message' | 'system' | 'alert';
  title: string;
  message: string;
  read: boolean;
  data: Record<string, any> | null;
  created_at: string;
}

export async function fetchUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    toast.error("Failed to load notifications");
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
}

export async function sendNotification(
  userId: string,
  type: 'appointment' | 'prescription' | 'message' | 'system' | 'alert',
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('send-notification', {
      body: {
        userId,
        type,
        title,
        message,
        data
      }
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    return false;
  }
}

export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return 0;
  }
}

// Setup a realtime subscription for new notifications
export function subscribeToNotifications(
  userId: string, 
  onNewNotification: (notification: Notification) => void
): () => void {
  const subscription = supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        onNewNotification(payload.new as Notification);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
}
