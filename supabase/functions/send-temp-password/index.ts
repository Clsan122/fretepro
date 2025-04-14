
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
    
    if (!email) {
      throw new Error("Email is required");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const tempPassword = generateTemporaryPassword();

    // First, get the user's UUID by their email
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      // If user not found by email, try to reset password directly
      const { error: resetError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      });

      if (resetError) throw resetError;

      // Send email with instructions instead of temporary password
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "Sistema <onboarding@resend.dev>",
        to: [email],
        subject: "Instruções para Redefinição de Senha",
        html: `
          <h1>Redefinição de Senha</h1>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p>Foi enviado um link de redefinição para seu email. Por favor, verifique sua caixa de entrada.</p>
          <p>Se você não solicitou esta redefinição, pode ignorar este email.</p>
        `,
      });

      if (emailError) throw emailError;

      return new Response(
        JSON.stringify({ message: "Instruções de redefinição enviadas com sucesso" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // User found, generate a temporary password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userData.id,
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
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
