
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const REDIRECT_URI = Deno.env.get('GOOGLE_REDIRECT_URI');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle different endpoints
    switch (path) {
      case 'auth-url':
        return handleAuthUrl(url);
      
      case 'callback':
        return await handleCallback(req, supabaseClient);
      
      case 'get-events':
        return await handleGetEvents(req, supabaseClient);
        
      case 'get-emails':
        return await handleGetEmails(req, supabaseClient);
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error("Error in google-integration function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Function to generate Google OAuth URL
function handleAuthUrl(url: URL) {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/gmail.readonly',
    'profile', 
    'email'
  ];
  
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', CLIENT_ID ?? '');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI ?? '');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  authUrl.searchParams.append('state', userId);
  
  return new Response(
    JSON.stringify({ authUrl: authUrl.toString() }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Function to handle OAuth callback
async function handleCallback(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const userId = url.searchParams.get('state');
  
  if (!code || !userId) {
    return new Response(JSON.stringify({ error: 'Invalid callback parameters' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID ?? '',
      client_secret: CLIENT_SECRET ?? '',
      redirect_uri: REDIRECT_URI ?? '',
      grant_type: 'authorization_code',
    }),
  });
  
  const tokenData = await tokenResponse.json();
  
  if (!tokenResponse.ok) {
    console.error("Error exchanging code for tokens:", tokenData);
    return new Response(JSON.stringify({ error: 'Failed to exchange code for tokens' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const { access_token, refresh_token, expires_in } = tokenData;
  const tokenExpiry = new Date(Date.now() + expires_in * 1000).toISOString();
  
  // Store tokens in database
  const { data, error } = await supabaseClient
    .from('integration_settings')
    .upsert([
      {
        user_id: userId,
        integration_type: 'google',
        is_connected: true,
        access_token,
        refresh_token,
        token_expiry: tokenExpiry,
        updated_at: new Date().toISOString()
      }
    ])
    .select();
  
  if (error) {
    console.error("Error storing tokens:", error);
    return new Response(JSON.stringify({ error: 'Failed to store tokens' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Redirect back to app
  return new Response(
    `<html>
      <body>
        <script>
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
          window.close();
        </script>
        <p>Authentication successful! You can close this window.</p>
      </body>
    </html>`, 
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

// Function to fetch Google Calendar events
async function handleGetEvents(req: Request, supabaseClient: any) {
  const { userId } = await req.json();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Get access token from database
  const { data: integrationData, error: integrationError } = await supabaseClient
    .from('integration_settings')
    .select('*')
    .eq('user_id', userId)
    .eq('integration_type', 'google')
    .single();
  
  if (integrationError || !integrationData) {
    return new Response(JSON.stringify({ error: 'Google integration not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const { access_token, token_expiry } = integrationData;
  
  // Check if token is expired, refresh if needed
  if (new Date(token_expiry) <= new Date()) {
    // Token refresh logic would go here
    return new Response(JSON.stringify({ error: 'Token expired, refresh not implemented yet' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Fetch Calendar events
  const eventsResponse = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?' + 
    new URLSearchParams({
      maxResults: '10',
      timeMin: new Date().toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime'
    }).toString(),
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  );
  
  if (!eventsResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Calendar events' }),
      {
        status: eventsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  const eventsData = await eventsResponse.json();
  
  return new Response(
    JSON.stringify({ events: eventsData.items }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Function to fetch Gmail messages
async function handleGetEmails(req: Request, supabaseClient: any) {
  const { userId } = await req.json();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Get access token from database
  const { data: integrationData, error: integrationError } = await supabaseClient
    .from('integration_settings')
    .select('*')
    .eq('user_id', userId)
    .eq('integration_type', 'google')
    .single();
  
  if (integrationError || !integrationData) {
    return new Response(JSON.stringify({ error: 'Google integration not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const { access_token, token_expiry } = integrationData;
  
  // Check if token is expired, refresh if needed
  if (new Date(token_expiry) <= new Date()) {
    // Token refresh logic would go here
    return new Response(JSON.stringify({ error: 'Token expired, refresh not implemented yet' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Fetch Gmail messages
  const messagesResponse = await fetch(
    'https://www.googleapis.com/gmail/v1/users/me/messages?' + 
    new URLSearchParams({
      maxResults: '10',
      q: 'is:unread'
    }).toString(),
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  );
  
  if (!messagesResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Gmail messages' }),
      {
        status: messagesResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  const messagesData = await messagesResponse.json();
  
  // Fetch email details (would be batched in production)
  const emails = [];
  for (const message of messagesData.messages || []) {
    const emailResponse = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );
    
    if (emailResponse.ok) {
      emails.push(await emailResponse.json());
    }
  }
  
  return new Response(
    JSON.stringify({ emails }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
