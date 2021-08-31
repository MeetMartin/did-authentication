import { passThrough, deepInspect, map, flatMap, compose, isNothing, Failure, Success, mergeEithers, eitherToAsyncEffect, mergeAsyncEffects } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getValueFromEnv } from '../../effects/Environment';
import { requestMATTRAccessToken } from '../../effects/MATTR';
import { createPresentationRequest } from '../../effects/Presentation';
import { readDID } from '../../effects/DID';
import { createJWS } from '../../effects/Messaging';

let timer = 0;
let updatedTimer = 0;
const startTimer = input => {
    timer = Date.now();
    updatedTimer = timer;
    //console.log('Performance timer started.');
    return input;
};
const updateTimer = where => input => {
    const totalTimer = Date.now() - timer;
    const sectionTimer = Date.now() - updatedTimer;
    //console.log(`Total: ${totalTimer} ms (${totalTimer/1000} s) | Section: ${sectionTimer} ms (${sectionTimer/1000}) s | Performance timer at ${where}.`);
    updatedTimer = Date.now();
    return input;
};

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
        map(updateTimer('created jws')),
        flatMap(data => createJWS({...request, ...data})),
        map(responses => ({request: responses[0].data?.request, didUrl: responses[1].data?.didDocument?.authentication[0]})),
        map(updateTimer('got presentation request and did')),
        () => getPresentationRequestAndDID(request)
    )();

const getJWSPresentationRequest = input =>
    compose(
        map(updateTimer('got jws')),
        flatMap(token => getJWS({accessToken: token, ...input})),
        map(response => response.data?.access_token),
        map(updateTimer('got mattr access token')),
        () => requestMATTRAccessToken({clientId: input.clientId, clientSecret: input.clientSecret})
    )();

const getAuthenticationEffect =
    compose(
        map(updateTimer('end of main composition')),
        map(passThrough(url => logger.debug(`DID Authentication Redirect URL: ${deepInspect(url)}`))),
        flatMap(getJWSPresentationRequest),
        map(updateTimer('converted either to asynceffect')),
        eitherToAsyncEffect,
        map(passThrough(input => logger.debug(`DID Authentication Input Variables: ${deepInspect(input)}`))),
        map(updateTimer('got variables')),
        getInputVariables,
        startTimer,
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