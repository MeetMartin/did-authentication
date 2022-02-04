import { passThrough, deepInspect, isEqual, isNothing, map, flatMap, compose, Failure, Success, validateEithers, eitherToAsyncEffect, AsyncEffect } from '@7urtle/lambda';

import logger from '../src/logger.js';
import { getClient, createDocument, getFaunaSecretFromEnv } from './Fauna.js';
import { encrypt, getEncryptionSecretsFromEnv } from './Encryption.js';
import { getChallenge } from './Challenge.js';

const validateChallengeSecret = request =>
    compose(
        flatMap(challenge =>
            isEqual(challenge.challengeSecret)(request.challengeSecret)
            ? AsyncEffect.of(_ => resolve => resolve(request))
            : AsyncEffect.of(reject => _ => reject('Invalid challenge secret.'))
        ),
        getChallenge
    )(request.challengeId);

const encryptDID = request =>
    compose(
        map(holder => ({ ...request, holder: holder })),
        flatMap(encrypt(request.holder)),
        getEncryptionSecretsFromEnv
    )();

const validateRequest =
    validateEithers(
        request => isNothing(request) ? Failure(`Request is Nothing.`) : Success(request),
        request => isNothing(request?.challengeId) ? Failure(`Request challengeId is Nothing.`) : Success(request),
        request => isNothing(request?.challengeSecret) ? Failure(`Request challengeSecret is Nothing.`) : Success(request),
        request => isNothing(request?.holder) ? Failure(`Request holder is Nothing.`) : Success(request),
        request => isEqual('true')(request?.verified) ? Failure(`Request verified is not true.`) : Success(request)
    );

const storeSuccessfulAuthentication = request =>
    compose(
        flatMap(client =>
            createDocument({
                client: client,
                data: {holder: request.holder, challengeId: request.challengeId, verified: request.verified },
                collection: 'authentications'
            })
        ),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    )();

const Callback = request =>
    compose(
        map(passThrough(() => logger.debug('DID Authentication Callback Request Stored In Fauna.'))),
        flatMap(storeSuccessfulAuthentication),
        flatMap(request => eitherToAsyncEffect(encryptDID(request))),
        flatMap(validateChallengeSecret),
        eitherToAsyncEffect,
        validateRequest,
        map(passThrough(request => logger.debug(`DID Authentication Callback Request: ${deepInspect(request)}`))),
    )(request);

export {
    Callback
};