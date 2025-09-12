import { handleSessionRequest } from './auth/session';
import { handleLogoutRequest } from './auth/logout';
import { handleCheckRequest } from './auth/check';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Roteamento dos endpoints
    if (path === '/auth/session') {
      return handleSessionRequest(request, env);
    }
    
    if (path === '/auth/logout') {
      return handleLogoutRequest(request, env);
    }
    
    if (path === '/auth/check') {
      return handleCheckRequest(request, env);
    }

    // Endpoint não encontrado
    return new Response(JSON.stringify({ ok: false, message: 'Not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
};
