import { passThrough, deepInspect, map, flatMap, compose, isNothing, Failure, Success, validateEithers, mergeEithers, eitherToAsyncEffect } from '@7urtle/lambda';
import { pushAuthentication } from 'didauth';

import logger from '../src/logger';
import { getDocumentByIndex, getClient, getFaunaSecretFromEnv } from './Fauna';
import { getValueFromEnv } from './Environment';

const validateRequest =
    validateEithers(
        request => isNothing(request?.challengeId) ? Failure('Request challengeId is Nothing.') : Success(request),
        request => isNothing(request?.userName) ? Failure('Request userName is Nothing.') : Success(request)
    );

const getVariables = () =>
    mergeEithers(
        getValueFromEnv('MATTR_CLIENT_ID'),
        getValueFromEnv('MATTR_CLIENT_SECRET'),
        getValueFromEnv('MATTR_TENANT'),
        getValueFromEnv('PRESENTATION_TEMPLATE_ID'),
        getValueFromEnv('VERIFIER_DID'),
        (map(url => `${url}/did/callback`)(getValueFromEnv('ngrok')))
        .orElse(() => getValueFromEnv('DIDAUTH_CALLBACK_URL'))
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

const getDIDByUserName = data =>
    compose(
        flatMap(client => getDocumentByIndex({ client: client, data: data, index: 'did_by_username' })),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    )();

const createPushAuthentication = request =>
    compose(
        flatMap(input => pushAuthentication({...request, ...input})),
        eitherToAsyncEffect,
        getInputVariables
    )();

const DIDPushAuthentication = request =>
    compose(
        map(passThrough(() => logger.debug('DID Push Authentication Success.'))),
        flatMap(did => createPushAuthentication({recipientDid: did, challengeId: request.challengeId})),
        map(response => response.data.did),
        flatMap(() => getDIDByUserName(request.userName)),
        validateRequest,
        map(passThrough(request => logger.debug(`DID Push Authentication Request: ${deepInspect(request)}`)))
    )(request);

export {
    DIDPushAuthentication
};