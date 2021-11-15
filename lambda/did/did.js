import { startsWith, lastOf, split, replace } from '@7urtle/lambda';

/*import { triggerAuthentication } from './AuthenticationService';
import { triggerPushAuthentication } from './PushAuthenticationService';
import { checkStatus } from './StatusService';
import { processCallback } from './CallbackService';

const router = path => request => 
  (startsWith('/did/authentication')(path) && triggerAuthentication(lastOf(split('/')(path)))) ||
  (startsWith('/did/push-authentication')(path) && triggerPushAuthentication(request && JSON.parse(request))) ||
  (startsWith('/did/callback')(path) && processCallback(request && JSON.parse(request))) ||
  (startsWith('/did/status')(path) && checkStatus(lastOf(split('/')(path)))) ||
  ({
    statusCode: 404,
    body: 'Not Found'
  });*/

import { triggerAuthentication } from './AuthenticationService';
import { checkStatus } from './StatusService';

const checkPayload = args => console.log('hello world', args) || ({ statusCode: 404, body: 'Not Found' });

const router = path => request => 
    (startsWith('/did/authentication')(path) && triggerAuthentication(lastOf(split('/')(path)))) ||
    (startsWith('/did/push-authentication')(path) && checkPayload(request && JSON.parse(request))) ||
    (startsWith('/did/callback')(path) && checkPayload(request && JSON.parse(request))) ||
    (startsWith('/did/status')(path) && checkStatus(lastOf(split('/')(path)))) ||
    ({
      statusCode: 404,
      body: 'Not Found'
    });

const handler = async (event, context) => router(replace('')('/.netlify/functions')(event.path))(event.body);

export { handler };