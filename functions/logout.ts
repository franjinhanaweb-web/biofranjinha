import { LogoutResponse } from './types';
import { corsHeaders, fullHeaders } from './cors';

export async function handleLogoutRequest(request: Request, env: any): Promise<Response> {
  console.log('🚪 [LOGOUT] Iniciando logout');
  console.log('🚪 [LOGOUT] Method:', request.method);
  console.log('🚪 [LOGOUT] URL:', request.url);
  
  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    console.log('🚪 [LOGOUT] CORS preflight request');
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  // Verificar se é POST
  if (request.method !== 'POST') {
    console.log('❌ [LOGOUT] Method not allowed:', request.method);
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers: fullHeaders,
    });
  }

  try {
    // Criar resposta de sucesso com cookie vazio para limpar
    const response: LogoutResponse = { ok: true, message: 'Logged out successfully' };
    const cookieValue = `__session=; Domain=.afranjinha.com.br; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
    
    console.log('✅ [LOGOUT] Cookie sendo limpo:', cookieValue);
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...fullHeaders,
        'Set-Cookie': cookieValue,
      },
    });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Internal server error' }), {
      status: 500,
      headers: fullHeaders,
    });
  }
}
