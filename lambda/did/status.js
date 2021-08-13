import { isNothing, isArray, isLessThan, isEqual, startsWith, Either, either, validateEithers, map, flatMap, compose, AsyncEffect, reduce } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getRecordByIndex, getClient, getSecret } from '../../effects/Fauna';
import { sign } from '../../effects/JWT';

const validateSignIn =
    validateEithers(
        request => isNothing(request.data.holder) || !startsWith('did:')(request.data.holder) ? Either.Failure(`holder is Nothing or not DID.`) : Either.Success(request),
        request => isNothing(request.data.verified) || isEqual('true')(request.data.verified) ? Either.Failure(`verified is Nothing or not true.`) : Either.Success(request),
        request => isNothing(request.ts) || isLessThan((Date.now() * 1000 - request.ts) / 60000000)(5) ? Either.Failure(`Age is Nothing or more than 5 minutes.`) : Either.Success(request)
    );

const getData = request => client =>
    isNothing(request)
    ? Either.Failure('DID request status data is Nothing.')
    : Either.Success({client, data: request});

const getSuccessfulSignIn = request =>
    map
    (result => ({...result, client: request.client}))
    (getRecordByIndex({client: request.client, data: request.data, index: 'signins_by_challengeid'}));
//const getUser2 = request => getRecordByIndex({client: request.client, data: request.data.holder, index: 'users_by_did'});
const getUser = resultEither =>
    either
    (() => AsyncEffect.of(_ => resolve => resolve(resultEither)))
    (request =>
        map
        (result => 
            isNothing(result.data)
            ? Either.Failure('User data is Nothing.')
            : Either.Success(result.data)
        )
        (getRecordByIndex({client: request.client, data: request.data.holder, index: 'users_by_did'})))
    (resultEither)

const getSignInStatusEffect = request =>
    compose(
        map(flatMap(getUser)), // Either(AsyncEffect(Either))
        map(map(validateSignIn)), // Either(AsyncEffect(Either))
        map(getSuccessfulSignIn), // Either(AsyncEffect)
        flatMap(getData(request)), // Either
        flatMap(getClient), // Either
        getSecret // Either
    )();

const errorsToError = error => isArray(error) ? reduce([])((a, c) => `${a} ${c}`)(error) : error;

const error500Response = {
    statusCode: 500,
    body: 'Internal Server Error'
};

const error404Response = {
    statusCode: 404,
    body: 'Not Found'
};

const checkStatus = request =>
    either
    (error => logger.error('Signins check processing: ' + errorsToError(error)) && error500Response)
    (effect =>
        effect.trigger
        (error => console.log('error', error) ||
            error == 'NotFound: instance not found'
            ? error404Response
            : logger.error('Fauna signins get record: ' + error) && error500Response
        )
        (
            either
            (error => logger.error('Signins found record: ' + errorsToError(error)) && error404Response)
            (result => console.log('test', result) || ({statusCode: 200}))
            //result => console.log('test', result) || ({statusCode: 200})
            /*either
            (error => logger.error('Signins found record: ' + errorsToError(error)) && error404Response)
            (effect =>
                effect.trigger
                (error => error == 'NotFound: instance not found'
                    ? error404Response // new user
                    : logger.error('Fauna get user: ' + error) && error500Response
                )
                (user => ({statusCode: 200})) // existing user
            )*/
        )
    )
    (getSignInStatusEffect(request));

export {
    checkStatus
};