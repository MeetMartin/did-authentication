import { passThrough, deepInspect, isEqual, map, flatMap, compose, isNothing, Failure, Success, validateEithers, mergeEithers, eitherToAsyncEffect, mergeAsyncEffects } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getRecordByIndex, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';
import { getValueFromEnv } from '../../effects/Environment';
import { requestMATTRAccessToken } from '../../effects/MATTR';
import { readDID } from '../../effects/DID';
import { createPresentationRequest } from '../../effects/Presentation';
import { createJWE, sendMessage } from '../../effects/Messaging';

const validateRequest =
    validateEithers(
        request => isNothing(request?.challengeId) ? Failure('Request challengeId is Nothing.') : Success(request),
        request => isNothing(request?.userName) ? Failure('Request userName is Nothing.') : Success(request)
    );

const getDIDByUserName = data => client =>
    getRecordByIndex({
        client: client,
        data: data,
        index: 'did_by_username'
    });

const getVariables = () =>
    mergeEithers(
        getValueFromEnv('CLIENT_ID'),
        getValueFromEnv('CLIENT_SECRET'),
        getValueFromEnv('TENANT'),
        getValueFromEnv('TEMPLATE_ID'),
        getValueFromEnv('VERIFIER_DID'),
        (map(url => `${url}/did/callback`)(getValueFromEnv('ngrok')))
        .orElse(() => getValueFromEnv('PRESENTATION_CALLBACK_URL'))
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2],
    templateId: list[3],
    did: list[4],
    presentationCallbackURL: list[5]
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

const createRequests = input =>
    compose(
        flatMap(message => sendMessage({...input, message: message})),
        map(response => response.data.jwe),
        flatMap(request => createJWE({...input, ...request, recipientDids: [input.recipientDid]})),
        map(responses => ({request: responses[0].data?.request, didUrl: responses[1].data?.didDocument?.keyAgreement[0]?.id})),
        getPresentationRequestAndDID
    )(input);

const createPushRequest = input =>
    compose(
        flatMap(accessToken => createRequests({...input, accessToken: accessToken})),
        map(response => response.data?.access_token),
        () => requestMATTRAccessToken({clientId: input.clientId, clientSecret: input.clientSecret}),
    )();

const createMATTRRequest = request =>
    compose(
        flatMap(input => createPushRequest({...request, ...input})),
        eitherToAsyncEffect,
        getInputVariables
    )();

const getAuthenticationEffect = request =>
    compose(
        map(passThrough(() => logger.debug('DID Push Authentication Success.'))),
        flatMap(did => createMATTRRequest({recipientDid: did, requestId: request.challengeId})),
        map(response => response.data.did),
        flatMap(getDIDByUserName(request.userName)),
        eitherToAsyncEffect,
        flatMap(getClient),
        flatMap(getFaunaSecretFromEnv),
        validateRequest,
        map(passThrough(request => logger.debug(`DID Push Authentication Request: ${deepInspect(request)}`)))
    )(request);

const pushAuthentication = request =>
    getAuthenticationEffect(request)
    .trigger
    (errors => map(error => logger.error(`DID Push Authentication: ${error}`))(errors) &&
        (isEqual('Getting Fauna Record By Index: NotFound: instance not found')(errors) &&
            ({
                statusCode: 401,
                body: JSON.stringify({authenticated: false, reason: 'This account does not exist. Please sign up first.'})
            })
        ) ||
        ({
            statusCode: 500,
            body: 'Internal Server Error'
        })
    )
    (() => ({
        statusCode: 204
    }));


export {
    pushAuthentication
};