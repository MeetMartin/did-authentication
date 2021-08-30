import { startsWith, lastOf, split } from '@7urtle/lambda';

import { triggerAuthentication } from './authentication';
import { processCallback } from './callback';
import { checkStatus } from './status';
  
const router = path => request => 
  (startsWith('/did/authentication')(path) && triggerAuthentication(lastOf(split('/')(path)))) ||
  (startsWith('/did/callback')(path) && processCallback(JSON.parse(request))) ||
  (startsWith('/did/status')(path) && checkStatus(lastOf(split('/')(path)))) ||
  ({
    statusCode: 404,
    body: 'Not Found'
  });

const handler = async (event, context) => router(event.path)(event.body);

export { handler };