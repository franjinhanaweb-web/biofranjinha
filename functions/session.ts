import { SessionRequest, SessionResponse, FirebaseSessionCookieRequest, FirebaseSessionCookieResponse } from './types';
import { corsHeaders, fullHeaders } from './cors';

export async function handleSessionRequest(request: Request, env: any): Promise<Response> {
  console.log('🔐 [SESSION] Iniciando criação de sessão');
  console.log('🔐 [SESSION] Method:', request.method);
  console.log('🔐 [SESSION] URL:', request.url);
  
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
    console.log('🔐 [SESSION] Valid Duration:', firebaseRequest.validDuration);

    const firebaseResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:createSessionCookie?key=${env.REACT_APP_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firebaseRequest),
      }
    );

    console.log('🔐 [SESSION] Firebase Response Status:', firebaseResponse.status);
    console.log('🔐 [SESSION] Firebase Response OK:', firebaseResponse.ok);

    if (!firebaseResponse.ok) {
      const errorText = await firebaseResponse.text();
      console.error('❌ [SESSION] Firebase Auth error:', firebaseResponse.status, firebaseResponse.statusText);
      console.error('❌ [SESSION] Error details:', errorText);
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
