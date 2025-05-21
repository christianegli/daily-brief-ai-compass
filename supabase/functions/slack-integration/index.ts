
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLIENT_ID = Deno.env.get('SLACK_CLIENT_ID');
const CLIENT_SECRET = Deno.env.get('SLACK_CLIENT_SECRET');
const REDIRECT_URI = Deno.env.get('SLACK_REDIRECT_URI');

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
      
      case 'get-messages':
        return await handleGetMessages(req, supabaseClient);
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error("Error in slack-integration function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Function to generate Slack OAuth URL
function handleAuthUrl(url: URL) {
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const scopes = [
    'channels:history',
    'channels:read',
    'chat:write',
    'groups:history',
    'im:history',
    'mpim:history',
    'users:read'
  ];
  
  const authUrl = new URL('https://slack.com/oauth/v2/authorize');
  authUrl.searchParams.append('client_id', CLIENT_ID ?? '');
  authUrl.searchParams.append('scope', scopes.join(','));
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI ?? '');
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
  const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID ?? '',
      client_secret: CLIENT_SECRET ?? '',
      redirect_uri: REDIRECT_URI ?? '',
    }),
  });
  
  const tokenData = await tokenResponse.json();
  
  if (!tokenData.ok) {
    console.error("Error exchanging code for tokens:", tokenData);
    return new Response(JSON.stringify({ error: 'Failed to exchange code for tokens' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const { access_token, refresh_token = null } = tokenData;
  
  // Store tokens in database
  const { data, error } = await supabaseClient
    .from('integration_settings')
    .upsert([
      {
        user_id: userId,
        integration_type: 'slack',
        is_connected: true,
        access_token,
        refresh_token,
        settings: { team_id: tokenData.team?.id, team_name: tokenData.team?.name },
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
          window.opener.postMessage({ type: 'SLACK_AUTH_SUCCESS' }, '*');
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

// Function to fetch Slack messages
async function handleGetMessages(req: Request, supabaseClient: any) {
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
    .eq('integration_type', 'slack')
    .single();
  
  if (integrationError || !integrationData) {
    return new Response(JSON.stringify({ error: 'Slack integration not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const { access_token } = integrationData;
  
  // Get channels list
  const channelsResponse = await fetch('https://slack.com/api/conversations.list', {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  
  if (!channelsResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Slack channels' }),
      {
        status: channelsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  const channelsData = await channelsResponse.json();
  
  if (!channelsData.ok) {
    return new Response(
      JSON.stringify({ error: channelsData.error }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Get messages from each channel
  const allMessages = [];
  for (const channel of channelsData.channels.slice(0, 3)) {
    const messagesResponse = await fetch(
      `https://slack.com/api/conversations.history?channel=${channel.id}&limit=10`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );
    
    if (messagesResponse.ok) {
      const messagesData = await messagesResponse.json();
      if (messagesData.ok) {
        allMessages.push({
          channelName: channel.name,
          channelId: channel.id,
          messages: messagesData.messages
        });
      }
    }
  }
  
  return new Response(
    JSON.stringify({ channels: allMessages }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
