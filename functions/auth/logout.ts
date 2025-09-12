import { handleLogoutRequest } from '../src/auth/logout';

export const onRequest: PagesFunction = (context) => {
  return handleLogoutRequest(context.request, context.env);
};
