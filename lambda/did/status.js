import { isNothing, isArray, isUndefined, isLessThan, isEqual, startsWith, Either, spy, eitherToAsyncEffect, validateEithers, map, flatMap, compose, AsyncEffect, reduce } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getRecordByIndex, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';
import { sign } from '../../effects/JWT';

const validateRequest = request =>
    isNothing(request)
    ? Either.Failure('DID request status data is Nothing.')
    : Either.Success(request);

const validateSignIn =
    validateEithers(
        request => isNothing(request.data.holder) || isNothing(request.data.verified) || isNothing(request.ts) ? Either.Failure('Sign In response is not complete.') : Either.Success(request),
        request => !startsWith('did:')(request.data.holder) ? Either.Failure(`Sign in holder is not DID.`) : Either.Success(request),
        request => isEqual('true')(request.data.verified) ? Either.Failure(`Sign in verified is not true.`) : Either.Success(request),
        request => isLessThan((Date.now() * 1000 - request.ts) / 60000000)(5) ? Either.Failure(`Sign in age is more than 5 minutes.`) : Either.Success(request)
    );

const error500Response = {
    statusCode: 500,
    body: 'Internal Server Error'
};

const getSuccessfulSignIn = client => request =>
    compose(
        flatMap(
            data => getRecordByIndex({
                client: client,
                data: data,
                index: 'signins_by_challengeid'
            })
        ),
        validateRequest
    )

const getSignInByChallengeId = data => client =>
    getRecordByIndex({
        client: client,
        data: data,
        index: 'signins_by_challengeid'
    });

const errorsToError = error => isArray(error) ? reduce([])((a, c) => `${a} ${c}`)(error) : error;

const errorToReasonMap = new Map([
    ['NotFound: instance not found', 'You did not scan the QR code using the wallet.']
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

const checkStatus = request =>
    checkSignInStatus(request)
    .trigger
    (error =>
        logger.error('Signins check processing: ' + errorsToError(error)) &&
        ({statusCode: 200, body: JSON.stringify({ verified: false, reason: errorToReason(error) })})
    )
    (result => console.log('test', result) || ({statusCode: 200, body: JSON.stringify({ verified: true })}));

const checkSignInStatus = request =>
    compose(
        flatMap(response => eitherToAsyncEffect(validateSignIn(response))),
        flatMap(getSignInByChallengeId(request)),
        eitherToAsyncEffect,
        flatMap(getClient),
        flatMap(getFaunaSecretFromEnv),
        validateRequest
    )(request);

export {
    checkStatus
};