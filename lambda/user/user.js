import { isNothing, substr, flatMap, compose, Either, either, lowerCaseOf } from '@7urtle/lambda';

import logger from '../../src/logger';
import { verify, getJWTSecretFromEnv } from '../../effects/JWT';
import { createUser } from './createUser';
import { readUser } from './readUser';
import { deleteUser } from './deleteUser';

const getJWT = event =>
    isNothing(event.headers?.authorization)
    ? Either.Failure('Authorization header is Nothing.')
    : Either.Success(event.headers.authorization);

const getToken = substr(300)(7);

const authorize = event =>
    compose(
        flatMap(verify(getToken(event.headers?.authorization))),
        flatMap(getJWTSecretFromEnv),
        getJWT
    )(event);

const router = event => decodedJWT => {
    switch(lowerCaseOf(event.method || event.httpMethod)) {
        case 'get':
            return readUser(decodedJWT.did);
        case 'post':
            return createUser(JSON.parse(event.body))(decodedJWT.did);
        case 'delete':
            return deleteUser(decodedJWT.did);
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