import { isNothing, isEqual, isArray, Either, either, validateEithers, map, flatMap, compose, reduce } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getClient, createRecord, getSecret } from '../../effects/Fauna';

const validateRequest =
    validateEithers(
        request => isNothing(request.challengeId) ? Either.Failure(`challengeId is Nothing.`) : Either.Success(request),
        request => isNothing(request.holder) ? Either.Failure(`holder is Nothing.`) : Either.Success(request),
        request => isEqual('true')(request.verified) ? Either.Failure(`verified is not true.`) : Either.Success(request)
    );

const getData = request => client => map(data => ({client, data}))(validateRequest(request));

const storeSuccessfulSignIn = request => createRecord({client: request.client, data: request.data, collection: 'signins'});

const getSuccessfulSignInEffect = request =>
    compose(
        map(storeSuccessfulSignIn),
        flatMap(getData(request)),
        flatMap(getClient),
        getSecret
    )();

const errorsToError = error => isArray(error) ? reduce([])((a, c) => `${a} ${c}`)(error) : error;

const error500Response = {
    statusCode: 500,
    body: 'Internal Server Error'
};

const processCallback = request =>
    either
    (error => logger.error('DID callback processing: ' + errorsToError(error)) && error500Response)
    (effect =>
        effect.trigger
        (error => logger.error('Fauna signins record creation: ' + error) && error500Response)
        (() => ({statusCode: 204}))
    )
    (getSuccessfulSignInEffect(request));

export {
    processCallback
};