
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  type: 'appointment' | 'prescription' | 'message' | 'system' | 'alert';
  title: string;
  message: string;
  data?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { userId, type, title, message, data } = await req.json() as NotificationRequest;

    if (!userId || !type || !title || !message) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields" 
        }), { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }

    // Create notification in database
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data: data || {},
        read: false
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    // Broadcast to realtime
    const broadcastData = {
      notification_id: notification.id,
      user_id: userId,
      type,
      title,
      message,
      data: data || {}
    };

    // This would be where you'd integrate with external notification services
    // e.g. email, push notifications, etc.
    
    return new Response(
      JSON.stringify({ 
        message: "Notification sent successfully", 
        notification_id: notification.id 
      }), { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error("Error sending notification:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }), { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );
  }
});
