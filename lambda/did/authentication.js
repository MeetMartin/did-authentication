import { map, flatMap, compose, isNothing, Failure, Success, mergeEithers, eitherToAsyncEffect, mergeAsyncEffects } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getValueFromEnv } from '../../effects/Environment';
import { requestMATTRAccessToken } from '../../effects/MATTR';
import { createPresentationRequest } from '../../effects/Presentation';
import { readDID } from '../../effects/DID';
import { createJWS } from '../../effects/Messaging';

const getId = id => isNothing(id) ? Failure('ID url path is Nothing.') : Success(id);

const getVariables = id =>
    mergeEithers(
        getValueFromEnv('CLIENT_ID'),
        getValueFromEnv('CLIENT_SECRET'),
        getValueFromEnv('TENANT'),
        getValueFromEnv('TEMPLATE_ID'),
        getValueFromEnv('VERIFIER_DID'),
        (map(url => `${url}/did/callback`)(getValueFromEnv('ngrok')))
        .orElse(() => getValueFromEnv('PRESENTATION_CALLBACK_URL')),
        getId(id)
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2],
    templateId: list[3],
    did: list[4],
    presentationCallbackURL: list[5],
    requestId: list[6]
});

const getInputVariables =
    compose(
        map(envListToObject),
        getVariables
    );

const getPresentationRequestAndDID = request =>
    mergeAsyncEffects(
        createPresentationRequest(request),
        readDID(request)
    );

const getJWSURL = payload => `https://${payload.tenant}/?request=${payload.jws}`;

const getJWS = request =>
    compose(
        map(jws => getJWSURL({tenant: request.tenant, jws: jws})),
        map(result => result.data),
        flatMap(data => createJWS({...request, ...data})),
        map(responses => ({request: responses[0].data?.request, didUrl: responses[1].data?.didDocument?.authentication[0]})),
        () => getPresentationRequestAndDID(request)
    )();

const getJWSPresentationRequest = input =>
    compose(
        flatMap(token => getJWS({accessToken: token, ...input})),
        map(response => response.data?.access_token),
        () => requestMATTRAccessToken({clientId: input.clientId, clientSecret: input.clientSecret})
    )();

const getAuthenticationEffect =
    compose(
        flatMap(getJWSPresentationRequest),
        eitherToAsyncEffect,
        getInputVariables
    );

const triggerAuthentication = id =>
    getAuthenticationEffect(id)
    .trigger
    (errors => map(error => logger.error(`DID Authentication: ${error}`))(errors) && ({
        statusCode: 500,
        body: 'Internal Server Error'
    }))
    (result => ({
        statusCode: 301,
        location: result
    }));

export {
    triggerAuthentication
};