import { SessionRequest, SessionResponse, FirebaseSessionCookieRequest, FirebaseSessionCookieResponse } from '../types';

export async function handleSessionRequest(request: Request, env: any): Promise<Response> {
  // Verificar se é POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  try {
    // Parse do body
    const body = await request.json() as SessionRequest;
    
    if (!body || typeof body !== 'object' || !body.idToken) {
      return new Response(JSON.stringify({ ok: false, message: 'ID Token is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // Chamar Firebase Auth REST API para criar session cookie
    const firebaseRequest: FirebaseSessionCookieRequest = {
      idToken: body.idToken,
      validDuration: 86400 // 24 horas em segundos
    };

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

    if (!firebaseResponse.ok) {
      console.error('Firebase Auth error:', firebaseResponse.status, firebaseResponse.statusText);
      return new Response(JSON.stringify({ ok: false, message: 'Authentication failed' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    const firebaseData = await firebaseResponse.json() as FirebaseSessionCookieResponse;

    // Criar resposta com cookie HttpOnly
    const response: SessionResponse = { ok: true };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'Set-Cookie': `__session=${firebaseData.sessionCookie}; Domain=.afranjinha.com.br; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
      },
    });

  } catch (error) {
    console.error('Session creation error:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}
