import { passThrough, deepInspect, isNothing, isArray, isUndefined, isLessThan, isEqual, startsWith, Either, eitherToAsyncEffect, validateEithers, map, flatMap, compose, reduce } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getRecordByIndex, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';
import { getJWTPrivateKeyFromEnv, sign } from '../../effects/JWT';

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

const getSignInByChallengeId = data => client =>
    getRecordByIndex({
        client: client,
        data: data,
        index: 'signins_by_challengeid'
    });

const errorToReasonMap = new Map([
    ['Getting Fauna Record By Index: NotFound: instance not found', 'You did not scan the QR code using the wallet.'],
    ['Sign in age is Nothing or more than 5 minutes.', 'Sign in was verified through wallet more than 5 minutes ago. Reload the page.']
]);

const errorToReason = error =>
    (reason =>
        isUndefined(reason)
        ? 'Unknown issue.'
        : reason
    )(
        isArray(error)
        ? errorToReasonMap.get(error[0] + '')
        : errorToReasonMap.get(error + '')
    );

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
        flatMap(getSignInByChallengeId(request)),
        eitherToAsyncEffect,
        flatMap(getClient),
        flatMap(getFaunaSecretFromEnv),
        validateRequest,
        map(passThrough(request => logger.debug(`DID Authentication Status Request: ${deepInspect(request)}`)))
    )(request);

const checkStatus = request =>
    checkSignInStatus(request)
    .trigger
    (errors => map(error => logger.error(`Signins status: ${error}`))(errors) &&
        ({statusCode: 200, body: JSON.stringify({ verified: false, reason: errorToReason(errors) })})
    )
    (result => ({statusCode: 200, body: JSON.stringify({ verified: true, bearer: result })}));

export {
    checkStatus
};