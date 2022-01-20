import { passThrough, deepInspect, isEqual, isNothing, map, flatMap, compose, Failure, Success, validateEithers, eitherToAsyncEffect } from '@7urtle/lambda';

import logger from '../src/logger';
import { getClient, createDocument, getFaunaSecretFromEnv } from './Fauna';
import { encrypt, getEncryptionSecretsFromEnv } from './Encryption';

const encryptDID = request =>
    compose(
        map(holder => ({ ...request, holder: holder })),
        flatMap(encrypt(request.holder)),
        getEncryptionSecretsFromEnv
    )();

const validateRequest =
    validateEithers(
        request => isNothing(request.challengeId) ? Failure(`Request challengeId is Nothing.`) : Success(request),
        request => isNothing(request.holder) ? Failure(`Request holder is Nothing.`) : Success(request),
        request => isEqual('true')(request.verified) ? Failure(`Request verified is not true.`) : Success(request)
    );

const storeSuccessfulSignIn = request =>
    compose(
        flatMap(client => createDocument({client: client, data: request, collection: 'signins'})),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    )();

const SignIn = request =>
    compose(
        map(passThrough(() => logger.debug('DID Authentication Callback Request Stored In Fauna.'))),
        flatMap(storeSuccessfulSignIn),
        eitherToAsyncEffect,
        map(passThrough(request => logger.debug(`DID Authentication Callback Request 3: ${deepInspect(request)}`))),
        flatMap(() => encryptDID(request)),
        map(passThrough(request => logger.debug(`DID Authentication Callback Request 2: ${deepInspect(request)}`))),
        validateRequest,
        map(passThrough(request => logger.debug(`DID Authentication Callback Request: ${deepInspect(request)}`))),
    )(request);

export {
    SignIn
};