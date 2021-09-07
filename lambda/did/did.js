import { startsWith, lastOf, split, replace } from '@7urtle/lambda';

import { triggerAuthentication } from './authentication';
import { pushAuthentication } from './pushAuthentication';
import { processCallback } from './callback';
import { checkStatus } from './status';
  
const router = path => request => 
  (startsWith('/did/authentication')(path) && triggerAuthentication(lastOf(split('/')(path)))) ||
  (startsWith('/did/push-authentication')(path) && pushAuthentication(request && JSON.parse(request))) ||
  (startsWith('/did/callback')(path) && processCallback(request && JSON.parse(request))) ||
  (startsWith('/did/status')(path) && checkStatus(lastOf(split('/')(path)))) ||
  ({
    statusCode: 404,
    body: 'Not Found'
  });

const handler = async (event, context) => router(replace('')('/.netlify/functions')(event.path))(event.body);

export { handler };