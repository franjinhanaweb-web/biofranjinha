import { handleSessionRequest } from '../session';

export const onRequest: PagesFunction = (context) => {
  return handleSessionRequest(context.request, context.env);
};