import { passThrough, deepInspect, isNothing, isLessThan, isEqual, startsWith, Either, eitherToAsyncEffect, validateEithers, map, flatMap, compose } from '@7urtle/lambda';

import logger from '../src/logger';
import { getDocumentByIndex, getClient, getFaunaSecretFromEnv } from './Fauna';
import { getJWTPrivateKeyFromEnv, sign } from './JWT';

const validateRequest = request =>
    isNothing(request)
    ? Either.Failure('DID request status data is Nothing.')
    : Either.Success(request);

const validateSignIn =
    validateEithers(
        request => isNothing(request?.data?.holder) || !startsWith('did:')(request.data.holder) ? Either.Failure(`Sign in holder is Nothing or not DID.`) : Either.Success(request),
        request => isNothing(request?.data?.verified) || isEqual('true')(request.data.verified) ? Either.Failure(`Sign in verified is Nothing or not true.`) : Either.Success(request),
        request => isNothing(request?.ts) || isLessThan((Date.now() * 1000 - request.ts) / 60000000)(5) ? Either.Failure(`Sign in age is Nothing or more than 5 minutes.`) : Either.Success(request)
    );

const getSignInByChallengeId = data =>
    compose (
        flatMap(client => getDocumentByIndex({ client: client, data: data, index: 'signins_by_challengeid' })),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    )();

const getJWT = challengeResponse =>
    compose(
        flatMap(sign({did: challengeResponse.data.holder})),
        flatMap(getJWTPrivateKeyFromEnv),
        validateSignIn,
    )(challengeResponse);

const checkSignInStatus = request =>
    compose(
        map(passThrough(response => logger.debug(`DID Authentication Status Response: ${deepInspect(response)}`))),
        flatMap(response => eitherToAsyncEffect(getJWT(response))),
        flatMap(() => getSignInByChallengeId(request)),
        eitherToAsyncEffect,
        validateRequest,
        map(passThrough(request => logger.debug(`DID Authentication Status Request: ${deepInspect(request)}`)))
    )(request);

export {
    checkSignInStatus
};