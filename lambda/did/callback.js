import { isNothing, isEqual, isArray, Either, either, validateEithers, AsyncEffect, map, flatMap, compose } from '@7urtle/lambda';
import faunadb from 'faunadb';

import logger from '../../src/logger';

const validateRequest =
    validateEithers(
        request => isNothing(request.challengeId) ? Either.Failure(`challengeId is Nothing.`) : Either.Success(request),
        request => isNothing(request.holder) ? Either.Failure(`holder is Nothing.`) : Either.Success(request),
        request => isEqual('true')(request.verified) ? Either.Failure(`verified is not true.`) : Either.Success(request)
    );

const getFaunaSecret = request =>
    isNothing(process.env.FAUNA_SECRET)
    ? Either.Failure('process.env.FAUNA_SECRET is Nothing.')
    : Either.Success({...request, faunaSecret: process.env.FAUNA_SECRET});

const getFaunaClient = request =>
    Either
    .try(() => ({
            ...request,
            client: new faunadb.Client({
                secret: request.faunaSecret
            })
        })    
    );

const storeSuccessfulSignIn = request =>
    AsyncEffect
    .ofPromise(() =>
        request.client.query(
            faunadb.query.Create(
                faunadb.query.Collection('signins'),
                {data: {challengeId: request.challengeId, holder: request.holder}}
            )
        )
    );

const getSuccessfulSignInEffect =
    compose(
        map(storeSuccessfulSignIn),
        flatMap(getFaunaClient),
        flatMap(getFaunaSecret),
        validateRequest
    );

const errorsToError = error => isArray(error) ? reduce([])((a, c) => `${a} ${c}`)(error) : error;

const error500Response = {
    statusCode: 500,
    body: 'Internal Server Error'
};

const processCallback = request =>
    either
    (error => logger.error(errorsToError(error)) && error500Response)
    (effect =>
        effect.trigger
        (error => logger.error(error) && error500Response)
        (() => ({statusCode: 204}))
    )
    (getSuccessfulSignInEffect(request));

export {
    processCallback
}