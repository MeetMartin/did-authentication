import { startsWith, lastOf, split, replace } from '@7urtle/lambda';

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

let timer = 0;
let updatedTimer = 0;
const startTimer = input => {
    timer = Date.now();
    updatedTimer = timer;
    console.log('DID Performance timer started.');
    return input;
};
const updateTimer = where => input => {
    const totalTimer = Date.now() - timer;
    const sectionTimer = Date.now() - updatedTimer;
    console.log(`Total: ${totalTimer} ms (${totalTimer/1000} s) | Section: ${sectionTimer} ms (${sectionTimer/1000}) s | DID Performance timer at ${where}.`);
    updatedTimer = Date.now();
    return input;
};

const handler = async (event, context) => {
  startTimer();
  const routerResult = router(replace('')('/.netlify/functions')(event.path))(event.body);
  console.log('got router result', routerResult);
  updateTimer('after router result')();
  return routerResult
  .then(result => {
    updateTimer('result in router result promise')();
    console.log('result', result);
    return result;
  })
  .catch(error => {
    updateTimer('error in router result promise')();
    console.log('error', error);
    return error;
  })
}

export { handler };