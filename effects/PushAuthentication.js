import { passThrough, deepInspect, map, flatMap, compose, isNothing, Either, Failure, Success, validateEithers, mergeEithers, eitherToAsyncEffect } from '@7urtle/lambda';
import { pushAuthentication } from 'didauth';
import { nanoid } from 'nanoid';

import logger from '../src/logger.js';
import { getDocumentByIndex, getClient, getFaunaSecretFromEnv } from './Fauna.js';
import { getValueFromEnv } from './Environment.js';
import { decrypt, getEncryptionSecretsFromEnv } from './Encryption.js';
import { saveChallenge } from './Challenge.js';

const getDencryptedDID = did =>
    compose(
        flatMap(decrypt(did)),
        getEncryptionSecretsFromEnv
    )();

const getCallbackURL = () =>
    (
        map
        (url => `${url}/did/callback`)
        (getValueFromEnv('ngrok'))
    )
    .orElse(() => getValueFromEnv('DIDAUTH_CALLBACK_URL'));

const validateRequest =
    validateEithers(
        request => isNothing(request?.requestId) ? Failure('Request requestId is Nothing.') : Success(request),
        request => isNothing(request?.userName) ? Failure('Request userName is Nothing.') : Success(request)
    );

const getVariables = () =>
    mergeEithers(
        getValueFromEnv('MATTR_CLIENT_ID'),
        getValueFromEnv('MATTR_CLIENT_SECRET'),
        getValueFromEnv('MATTR_TENANT'),
        getValueFromEnv('PRESENTATION_TEMPLATE_ID'),
        getValueFromEnv('VERIFIER_DID'),
        getCallbackURL(),
        Either.try(nanoid)
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2],
    templateId: list[3],
    did: list[4],
    callbackURL: list[5],
    challengeId: list[6]
});

const getEnvironmentVariables =
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
        flatMap(pushAuthentication),
        flatMap(saveChallenge),
        eitherToAsyncEffect,
        map(inputs => ({ ...inputs, ...request })),
        getEnvironmentVariables
    )();

const DIDPushAuthentication = request =>
    compose(
        map(passThrough(() => logger.debug('DID Push Authentication Success.'))),
        flatMap(recipientDid => createPushAuthentication({ ... request, recipientDid: recipientDid })),
        flatMap(did => eitherToAsyncEffect(getDencryptedDID(did))),
        map(response => response.data.did),
        flatMap(() => getDIDByUserName(request.userName)),
        eitherToAsyncEffect,
        validateRequest,
        map(passThrough(request => logger.debug(`DID Push Authentication Request: ${deepInspect(request)}`)))
    )(request);

export {
    DIDPushAuthentication
};