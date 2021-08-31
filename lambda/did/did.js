//import { startsWith, lastOf, split, replace } from '@7urtle/lambda';
import { isEqual } from 'C:/Users/ragnarecek/code/lambda/dist/lambda.min.js';

/*import { triggerAuthentication } from './authentication';
import { processCallback } from './callback';
import { checkStatus } from './status';
  
const router = path => request => 
  (startsWith('/did/authentication')(path) && triggerAuthentication(lastOf(split('/')(path)))) ||
  (startsWith('/did/callback')(path) && processCallback(JSON.parse(request))) ||
  (startsWith('/did/status')(path) && checkStatus(lastOf(split('/')(path)))) ||
  ({
    statusCode: 404,
    body: 'Not Found'
  });*/

const handler = async (event, context) => console.log('test', event.path, event.body, isEqual('jedna')('jedna')) || ({statusCode: 200, body: 'hello there'}); //router(replace('')('/.netlify/functions')(event.path))(event.body);

export { handler };