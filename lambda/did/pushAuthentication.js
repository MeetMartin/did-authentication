import { passThrough, deepInspect, isEqual, map, flatMap, compose, isNothing, Failure, Success, validateEithers, mergeEithers, eitherToAsyncEffect, mergeAsyncEffects } from '@7urtle/lambda';
import { pushAuthentication } from 'didauth';

import logger from '../../src/logger';
import { getRecordByIndex, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';
import { getValueFromEnv } from '../../effects/Environment';

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
        .orElse(() => getValueFromEnv('CALLBACK_URL'))
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2],
    templateId: list[3],
    did: list[4],
    callbackURL: list[5]
});

const getInputVariables =
    compose(
        map(envListToObject),
        getVariables
    );

const createMATTRRequest = request =>
    compose(
        flatMap(input => pushAuthentication({...request, ...input})),
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

const triggerPushAuthentication = request =>
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
    triggerPushAuthentication
};