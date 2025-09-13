import { CheckResponse } from './types';
import { corsHeaders, fullHeaders } from './cors';

export async function handleCheckRequest(request: Request, env: any): Promise<Response> {
  console.log('🔍 [CHECK] Verificando sessão');
  console.log('🔍 [CHECK] Method:', request.method);
  console.log('🔍 [CHECK] URL:', request.url);
  
  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    console.log('🔍 [CHECK] CORS preflight request');
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  // Verificar se é GET
  if (request.method !== 'GET') {
    console.log('❌ [CHECK] Method not allowed:', request.method);
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers: fullHeaders,
    });
  }

  try {
    // Verificar se existe o cookie __session
    const cookieHeader = request.headers.get('Cookie');
    console.log('🔍 [CHECK] Cookie Header:', cookieHeader ? 'Presente' : 'Ausente');
    console.log('🔍 [CHECK] Cookie Header length:', cookieHeader?.length || 0);
    
    const hasSession = cookieHeader ? cookieHeader.includes('__session=') : false;
    console.log('🔍 [CHECK] Has Session:', hasSession);
    
    if (hasSession) {
      console.log('✅ [CHECK] Sessão encontrada');
    } else {
      console.log('❌ [CHECK] Sessão não encontrada');
    }

    const response: CheckResponse = { 
      ok: true, 
      hasSession 
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: fullHeaders,
    });

  } catch (error) {
    console.error('Check error:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Internal server error' }), {
      status: 500,
      headers: fullHeaders,
    });
  }
}
