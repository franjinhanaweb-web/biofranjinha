import { LogoutResponse } from '../types';

export async function handleLogoutRequest(request: Request, env: any): Promise<Response> {
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
    // Criar resposta de sucesso com cookie vazio para limpar
    const response: LogoutResponse = { ok: true, message: 'Logged out successfully' };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'Set-Cookie': `__session=; Domain=.afranjinha.com.br; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
      },
    });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}
