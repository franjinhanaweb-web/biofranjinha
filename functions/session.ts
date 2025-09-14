import { SessionRequest, SessionResponse, FirebaseSessionCookieRequest, FirebaseSessionCookieResponse } from './types';
import { corsHeaders, fullHeaders } from './cors';

export async function handleSessionRequest(request: Request, env: any): Promise<Response> {
  console.log('🔐 [SESSION] Iniciando criação de sessão');
  console.log('🔐 [SESSION] Method:', request.method);
  console.log('🔐 [SESSION] URL:', request.url);
  console.log('🔐 [SESSION] Variáveis de ambiente disponíveis:', Object.keys(env));
  console.log('🔐 [SESSION] REACT_APP_FIREBASE_API_KEY existe:', 'REACT_APP_FIREBASE_API_KEY' in env);
  console.log('🔐 [SESSION] REACT_APP_FIREBASE_API_KEY valor:', env.REACT_APP_FIREBASE_API_KEY ? 'DEFINIDA' : 'UNDEFINED');
  
  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    console.log('🔐 [SESSION] CORS preflight request');
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  // Verificar se é POST
  if (request.method !== 'POST') {
    console.log('❌ [SESSION] Method not allowed:', request.method);
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers: fullHeaders,
    });
  }

  try {
    // Parse do body
    const body = await request.json() as SessionRequest;
    console.log('🔐 [SESSION] Body recebido:', { hasIdToken: !!body?.idToken, bodyLength: JSON.stringify(body).length });
    
    if (!body || typeof body !== 'object' || !body.idToken) {
      console.log('❌ [SESSION] ID Token não fornecido');
      return new Response(JSON.stringify({ ok: false, message: 'ID Token is required' }), {
        status: 400,
        headers: fullHeaders,
      });
    }

    // Chamar Firebase Auth REST API para criar session cookie
    const firebaseRequest: FirebaseSessionCookieRequest = {
      idToken: body.idToken,
      validDuration: 86400 // 24 horas em segundos
    };

    console.log('🔐 [SESSION] Chamando Firebase Auth API...');
    console.log('🔐 [SESSION] Firebase API Key configurada:', !!env.REACT_APP_FIREBASE_API_KEY);
    console.log('🔐 [SESSION] Firebase API Key valor (primeiros 10 chars):', env.REACT_APP_FIREBASE_API_KEY ? env.REACT_APP_FIREBASE_API_KEY.substring(0, 10) + '...' : 'UNDEFINED');
    console.log('🔐 [SESSION] Valid Duration:', firebaseRequest.validDuration);
    console.log('🔐 [SESSION] ID Token length:', body.idToken.length);
    console.log('🔐 [SESSION] ID Token prefix:', body.idToken.substring(0, 20) + '...');

    // Log da URL completa que será chamada
    const firebaseUrl = `https://identitytoolkit.googleapis.com/v1/accounts:createSessionCookie?key=${env.REACT_APP_FIREBASE_API_KEY}`;
    console.log('🔐 [SESSION] URL completa da requisição:', firebaseUrl);
    console.log('🔐 [SESSION] Body da requisição:', JSON.stringify(firebaseRequest, null, 2));

    const firebaseResponse = await fetch(firebaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(firebaseRequest),
    });

    console.log('🔐 [SESSION] Firebase Response Status:', firebaseResponse.status);
    console.log('🔐 [SESSION] Firebase Response OK:', firebaseResponse.ok);

    if (!firebaseResponse.ok) {
      const errorText = await firebaseResponse.text();
      console.error('❌ [SESSION] Firebase Auth error:', firebaseResponse.status, firebaseResponse.statusText);
      console.error('❌ [SESSION] Error details:', errorText);
      console.error('❌ [SESSION] Headers da resposta:', Object.fromEntries(firebaseResponse.headers.entries()));
      console.error('❌ [SESSION] URL que falhou:', firebaseUrl);
      console.error('❌ [SESSION] API Key usada (primeiros 10 chars):', env.REACT_APP_FIREBASE_API_KEY ? env.REACT_APP_FIREBASE_API_KEY.substring(0, 10) + '...' : 'UNDEFINED');
      return new Response(JSON.stringify({ ok: false, message: 'Authentication failed' }), {
        status: 401,
        headers: fullHeaders,
      });
    }

    const firebaseData = await firebaseResponse.json() as FirebaseSessionCookieResponse;
    console.log('✅ [SESSION] Firebase Session Cookie criado com sucesso');
    console.log('✅ [SESSION] Session Cookie length:', firebaseData.sessionCookie?.length || 0);

    // Criar resposta com cookie HttpOnly
    const response: SessionResponse = { ok: true };
    const cookieValue = `__session=${firebaseData.sessionCookie}; Domain=.afranjinha.com.br; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`;
    
    console.log('✅ [SESSION] Cookie configurado:', cookieValue.substring(0, 50) + '...');
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...fullHeaders,
        'Set-Cookie': cookieValue,
      },
    });

  } catch (error) {
    console.error('Session creation error:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Internal server error' }), {
      status: 500,
      headers: fullHeaders,
    });
  }
}
