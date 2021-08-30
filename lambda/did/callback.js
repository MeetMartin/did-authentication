import { isEqual, isNothing, map, flatMap, compose, Failure, Success, validateEithers, eitherToAsyncEffect } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getClient, createRecord, getFaunaSecretFromEnv } from '../../effects/Fauna';

const validateRequest =
    validateEithers(
        request => isNothing(request.challengeId) ? Failure(`Request challengeId is Nothing.`) : Success(request),
        request => isNothing(request.holder) ? Failure(`Request holder is Nothing.`) : Success(request),
        request => isEqual('true')(request.verified) ? Failure(`Request verified is not true.`) : Success(request)
    );

const storeSuccessfulSignIn = request => createRecord({client: request.client, data: request.data, collection: 'signins'});

const getSuccessfulSignInEffect = request =>
    compose(
        flatMap(client => storeSuccessfulSignIn({client: client, data: request})),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv,
        validateRequest
    )(request);

const processCallback = request =>
    getSuccessfulSignInEffect(request)
    .trigger
    (errors => map(error => logger.error(`DID Callback: ${error}`))(errors) && ({
        statusCode: 500,
        body: 'Internal Server Error'
    }))
    (() => ({
        statusCode: 204
    }));

export {
    processCallback
};