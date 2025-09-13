// Headers CORS para permitir requisições de www.afranjinha.com.br
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.afranjinha.com.br',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 horas
};

// Headers de segurança
export const securityHeaders = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

// Headers completos (CORS + Segurança)
export const fullHeaders = {
  ...corsHeaders,
  ...securityHeaders,
};
