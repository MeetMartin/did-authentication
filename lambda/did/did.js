import { map, flatMap, isNothing, Either, either, mergeEithers, compose, reduce, AsyncEffect } from '@7urtle/lambda';
import logger from '../../src/logger';

import { requestMATTRAccessToken } from '../../effects/MATTR';
import { createPresentationRequest } from '../../effects/Presentation';

const getValueFromEnv = key => isNothing(process.env[key]) ? Either.Failure(`process.env.${key} is Nothing.`) : Either.Success(process.env[key]);

const error500Response = {
  statusCode: 500,
  body: 'Internal Server Error'
};

const getPresentationCallbackURL = () =>
  (envEither =>
    envEither.isFailure()
    ? getValueFromEnv('ngrok')
    : envEither
  )(getValueFromEnv('PRESENTATION_CALLBACK_URL'));

const getEnvironmentVariables = () =>
  mergeEithers(
    getValueFromEnv('CLIENT_ID'),
    getValueFromEnv('CLIENT_SECRET'),
    getValueFromEnv('TENANT'),
    getValueFromEnv('TEMPLATE_ID'),
    getValueFromEnv('VERIFIER_DID'),
    getPresentationCallbackURL() // uses process.env.PRESENTATION_CALLBACK_URL or process.env.ngrok
  );

const valuesToPayload = values => ({
    clientId: values[0],
    clientSecret: values[1],
    tenant: values[2],
    templateID: values[3],
    verifierDID: values[4],
    presentationCallbackURL: values[5]
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

const getAuthenticationEffect = compose(
  map(flatMap(getPayloadWithPresentationRequest)), // => Either(AsyncEffect(Either))
  map(getPayloadWithAccessToken), // => Either(AsyncEffect(Either))
  map(valuesToPayload), // => Either
  getEnvironmentVariables // => Either
);

const errorsToError = reduce([])((a, c) => `${a} ${c}`);

const triggerAuthentication = () =>
  either
  (errors => logger.error(errorsToError(errors)) && error500Response)
  (effect =>
    effect.trigger
    (error => logger.error(`${error.response.status} ${error.response.statusText}`, error.response.data) && error500Response)
    (
      either
      (errors => logger.error(errorsToError(errors)) && error500Response)
      (result => ({
        statusCode: 200,
        body: JSON.stringify(result)
      }))
    )
  )
  (getAuthenticationEffect());
  
const router = path => {
  switch(path) {
    case '/did/authentication':
      return triggerAuthentication();
    case '/did/callback':
      return 'I am a callback';
    default:
      return 'I am default.' + path;  
  }
};

const handler = async (event, context) => router(event.path);

export {handler};