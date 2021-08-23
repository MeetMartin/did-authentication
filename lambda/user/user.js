import { createUser } from './createUser';
import { isNothing, substr, flatMap, compose, Either, either } from '@7urtle/lambda';

import logger from '../../src/logger';
import { verify, getJWTPrivateKeyFromEnv } from '../../effects/JWT';

const getJWT = event =>
    isNothing(event.headers?.authorization)
    ? Either.Failure('Authorization header is Nothing.')
    : Either.Success(event.headers.authorization);

const getToken = substr(300)(7);

const authorize = event =>
    compose(
        flatMap(verify(getToken(event.headers?.authorization))),
        flatMap(getJWTPrivateKeyFromEnv),
        getJWT
    )(event);

const router = event => decodedJWT => {
    switch(event.method) {
        case 'get':
            return ({statusCode: 204});
        case 'post':
            return createUser(JSON.parse(event.body))(decodedJWT.did);
        default:
            return ({statusCode: 400, body: 'Bad Request'})
    }
};

const handler = async (event, context) =>
    either
    (error => logger.error(`User Function Authorization: ${error}`) && ({statusCode: 401, body: 'Unauthorized'}))
    (router(event))
    (authorize(event));

export {handler};