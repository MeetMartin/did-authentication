import { startsWith, lastOf, split, map, flatMap, isNothing, Either, either, mergeEithers, compose, reduce, AsyncEffect } from '@7urtle/lambda';
import logger from '../../src/logger';

import { requestMATTRAccessToken } from '../../effects/MATTR';
import { createPresentationRequest } from '../../effects/Presentation';
import { readDID } from '../../effects/DID';
import { createJWS } from '../../effects/Messaging';

const getValueFromEnv = key => isNothing(process.env[key]) ? Either.Failure(`process.env.${key} is Nothing.`) : Either.Success(process.env[key]);

const error500Response = {
  statusCode: 500,
  body: 'Internal Server Error'
};

const getPresentationCallbackURL = () =>
  (envEither =>
    envEither.isFailure()
    ? map(url => `${url}/did/callback`)(getValueFromEnv('ngrok'))
    : envEither
  )(getValueFromEnv('PRESENTATION_CALLBACK_URL'));

const getId = id => isNothing(id) ? Either.Failure('ID is Nothing.') : Either.Success(id);

const getInputVariables = id =>
  mergeEithers(
    getValueFromEnv('CLIENT_ID'),
    getValueFromEnv('CLIENT_SECRET'),
    getValueFromEnv('TENANT'),
    getValueFromEnv('TEMPLATE_ID'),
    getValueFromEnv('VERIFIER_DID'),
    getPresentationCallbackURL(), // uses process.env.PRESENTATION_CALLBACK_URL or process.env.ngrok,
    getId(id) // passed from QR code url
  );

const valuesToPayload = values => ({
    clientId: values[0],
    clientSecret: values[1],
    tenant: values[2],
    templateID: values[3],
    did: values[4],
    presentationCallbackURL: values[5],
    requestId: values[6]
  });

const getPayloadWithAccessToken = payload =>
  map
  (result =>
    isNothing(result.data?.access_token)
    ? Either.Failure('Access Token is Nothing.')
    : Either.Success({...payload, accessToken: result.data.access_token})
  )
  (requestMATTRAccessToken(payload));

const getPayloadWithPresentationRequest = payloadEither =>
  either
  (() => AsyncEffect.of(_ => resolve => resolve(payloadEither)))
  (payload =>
    map
    (result =>
      isNothing(result.data?.request)
      ? Either.Failure('Presentation Request is Nothing.')
      : Either.Success({...payload, request: result.data.request})
    )
    (createPresentationRequest(payload))
  )
  (payloadEither);

const getPayloadWithDIDURL = payloadEither =>
  either
  (() => AsyncEffect.of(_ => resolve => resolve(payloadEither)))
  (payload =>
    map
    (result =>
      isNothing(result.data?.didDocument?.authentication[0])
      ? Either.Failure('Verifier DID URL is Nothing.')
      : Either.Success({...payload, didUrl: result.data.didDocument.authentication[0]})
    )
    (readDID(payload))
  )
  (payloadEither);

const getPayloadWithJWS = payloadEither =>
  either
  (() => AsyncEffect.of(_ => resolve => resolve(payloadEither)))
  (payload =>
    map
    (result =>
      isNothing(result.data)
      ? Either.Failure('JWS is Nothing.')
      : Either.Success({...payload, jws: result.data})
    )
    (createJWS(payload))
  )
  (payloadEither);

const getJWSURL = payload => `https://${payload.tenant}/?request=${payload.jws}`;

const getAuthenticationEffect = compose(
  map(map(map(getJWSURL))), // => Either(AsyncEffect(Either))
  map(flatMap(getPayloadWithJWS)), // => Either(AsyncEffect(Either))
  map(flatMap(getPayloadWithDIDURL)), // => Either(AsyncEffect(Either))
  map(flatMap(getPayloadWithPresentationRequest)), // => Either(AsyncEffect(Either))
  map(getPayloadWithAccessToken), // => Either(AsyncEffect(Either))
  map(valuesToPayload), // => Either
  getInputVariables // => Either
);

const errorsToError = reduce([])((a, c) => `${a} ${c}`);

const triggerAuthentication = id =>
  either
  (errors => logger.error(errorsToError(errors)) && error500Response)
  (effect =>
    effect.trigger
    (error => logger.error(`${error.response.status} ${error.response.statusText} ${error.response.config.url} ${error.response.data?.details[0]?.msg ? error.response.data.details[0].msg : ''}`) && error500Response) 
    (
      either
      (errors => logger.error(errorsToError(errors)) && error500Response)
      (result => ({
        statusCode: 301,
        location: result
      }))
    )
  )
  (getAuthenticationEffect(id));

const processCallback = request => console.log(JSON.stringify(request)) || ({
  statusCode: 200,
  body: 'I am done here'
});
  
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