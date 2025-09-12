import { handleSessionRequest } from '../src/auth/session';

export const onRequest: PagesFunction = (context) => {
  return handleSessionRequest(context.request, context.env);
};
