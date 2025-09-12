import { handleCheckRequest } from '../check';

export const onRequest: PagesFunction = (context) => {
  return handleCheckRequest(context.request, context.env);
};