import { passThrough, deepInspect, isNothing, isLessThan, isEqual, startsWith, Either, eitherToAsyncEffect, validateEithers, map, flatMap, compose } from '@7urtle/lambda';

import logger from '../src/logger.js';
import { getDocumentByIndex, getClient, getFaunaSecretFromEnv } from './Fauna.js';
import { getJWTSecretFromEnv, sign } from './JWT.js';

const validateRequest = request =>
    isNothing(request)
    ? Either.Failure('DID request status data is Nothing.')
    : Either.Success(request);

const validateSignIn =
    validateEithers(
        request => isNothing(request?.data?.holder) ? Either.Failure(`Authentication holder is Nothing.`) : Either.Success(request),
        request => isNothing(request?.data?.verified) || isEqual('true')(request.data.verified) ? Either.Failure(`Authentication verified is Nothing or not true.`) : Either.Success(request),
        request => isNothing(request?.ts) || isLessThan((Date.now() * 1000 - request.ts) / 60000000)(5) ? Either.Failure(`Authentication age is Nothing or more than 5 minutes.`) : Either.Success(request)
    );

const getAuthenticationByRequestId = data =>
    compose (
        flatMap(client => getDocumentByIndex({ client: client, data: data, index: 'authentications_by_requestid' })),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    )();

const getJWT = challengeResponse =>
    compose(
        flatMap(sign({did: challengeResponse.data.holder})),
        flatMap(getJWTSecretFromEnv),
        validateSignIn,
    )(challengeResponse);

const checkAuthenticationStatus = request =>
    compose(
        map(passThrough(response => logger.debug(`DID Authentication Status Response: ${deepInspect(response)}`))),
        flatMap(response => eitherToAsyncEffect(getJWT(response))),
        flatMap(() => getAuthenticationByRequestId(request)),
        eitherToAsyncEffect,
        validateRequest,
        map(passThrough(request => logger.debug(`DID Authentication Status Request: ${deepInspect(request)}`)))
    )(request);

export {
    checkAuthenticationStatus
};