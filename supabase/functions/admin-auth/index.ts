import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if the email is in the admin_users allowlist
    const { data: adminUser, error: adminError } = await adminClient
      .from("admin_users")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (adminError || !adminUser) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to sign in with Supabase Auth
    const { data: authData, error: authError } =
      await adminClient.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

    if (authError) {
      // If the user doesn't exist in auth.users yet, try to create them
      if (authError.message.includes("Invalid login credentials")) {
        // Check if any auth user exists for this email
        const { data: existingUsers } = await adminClient.auth.admin.listUsers();
        const userExists = existingUsers?.users?.some(
          (u: { email?: string }) => u.email === email.toLowerCase().trim()
        );

        if (!userExists) {
          // Create the auth user with the provided password
          const { data: newUser, error: createError } =
            await adminClient.auth.admin.createUser({
              email: email.toLowerCase().trim(),
              password,
              email_confirm: true,
            });

          if (createError || !newUser) {
            return new Response(
              JSON.stringify({ error: "Unable to authenticate. Please contact support." }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Now sign in
          const { data: retryAuth, error: retryError } =
            await adminClient.auth.signInWithPassword({
              email: email.toLowerCase().trim(),
              password,
            });

          if (retryError || !retryAuth.session) {
            return new Response(
              JSON.stringify({ error: "Authentication failed after user creation" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          return new Response(
            JSON.stringify({
              session: retryAuth.session,
              user: retryAuth.user,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData.session) {
      return new Response(
        JSON.stringify({ error: "No session returned" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        session: authData.session,
        user: authData.user,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
