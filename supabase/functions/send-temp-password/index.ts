
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const generateTemporaryPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let temp = "";
  for (let i = 0; i < 12; i++) {
    temp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return temp;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const tempPassword = generateTemporaryPassword();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update user's password to the temporary one
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      email,
      { password: tempPassword }
    );

    if (updateError) throw updateError;

    // Send email with temporary password
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Sistema <onboarding@resend.dev>",
      to: [email],
      subject: "Sua Senha Temporária",
      html: `
        <h1>Redefinição de Senha</h1>
        <p>Aqui está sua senha temporária: <strong>${tempPassword}</strong></p>
        <p>Por favor, faça login com esta senha temporária e altere-a imediatamente.</p>
        <p>Esta senha é válida apenas para um único acesso.</p>
      `,
    });

    if (emailError) throw emailError;

    return new Response(
      JSON.stringify({ message: "Senha temporária enviada com sucesso" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
