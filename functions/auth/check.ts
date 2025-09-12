import { handleCheckRequest } from '../src/auth/check';

export const onRequest: PagesFunction = (context) => {
  return handleCheckRequest(context.request, context.env);
};
