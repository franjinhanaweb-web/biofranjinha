import { CheckResponse } from './types';

export async function handleCheckRequest(request: Request, env: any): Promise<Response> {
  // Verificar se é GET
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  try {
    // Verificar se existe o cookie __session
    const cookieHeader = request.headers.get('Cookie');
    const hasSession = cookieHeader ? cookieHeader.includes('__session=') : false;

    const response: CheckResponse = { 
      ok: true, 
      hasSession 
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Check error:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}
