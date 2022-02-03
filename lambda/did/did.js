import { startsWith, lastOf, split, replace } from '@7urtle/lambda';

import { triggerAuthentication } from './AuthenticationService.js';
import { triggerPushAuthentication } from './PushAuthenticationService.js';
import { checkStatus } from './StatusService.js';
import { processCallback } from './CallbackService.js';

const endOfPath = path => lastOf(split('/')(path));

const router = path => request => 
  (startsWith('/did/authentication')(path) && triggerAuthentication(endOfPath(path))) ||
  (startsWith('/did/push-authentication')(path) && triggerPushAuthentication(request && JSON.parse(request))) ||
  (startsWith('/did/callback')(path) && processCallback(request && JSON.parse(request))) ||
  (startsWith('/did/status')(path) && checkStatus(endOfPath(path))) ||
  ({
    statusCode: 404,
    body: 'Not Found'
  });

const handler = async (event, context) => router(replace('')('/.netlify/functions')(event.path))(event.body);

export { handler };