import { startsWith, lastOf, split } from '@7urtle/lambda';

import { triggerAuthentication } from './authentication';
import { processCallback } from './callback';
  
const router = path => request => {
  if(startsWith('/did/authentication')(path)) return triggerAuthentication(lastOf(split('/')(path)));

  if(startsWith('/did/callback')(path)) return processCallback(JSON.parse(request));

  return {
    statusCode: 404,
    body: 'Not Found'
  };
};

const handler = async (event, context) => router(event.path)(event.body);

export {handler};