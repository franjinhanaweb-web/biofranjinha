import { handleLogoutRequest } from '../logout';

export const onRequest: PagesFunction = (context) => {
  return handleLogoutRequest(context.request, context.env);
};