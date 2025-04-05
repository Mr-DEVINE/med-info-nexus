
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ 
          error: "Email and password are required" 
        }), { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }

    // Check if admin already exists
    const { data: existingUsers, error: searchError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (searchError) {
      throw searchError;
    }

    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ 
          message: "Admin user already exists", 
          adminExists: true 
        }), { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }

    // Create admin user
    const { data: userData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { role: "admin" }
    });

    if (signUpError) {
      throw signUpError;
    }

    // Update profile with admin role
    if (userData.user) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: "admin" })
        .eq("id", userData.user.id);

      if (updateError) {
        throw updateError;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Admin user created successfully", 
        user: userData.user 
      }), { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error("Error creating admin user:", error);
    
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
