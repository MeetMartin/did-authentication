import { passThrough, deepInspect, eitherToAsyncEffect, map, flatMap, compose, isEqual } from '@7urtle/lambda';

import logger from '../../src/logger';
import { createDocument, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';

const createUserDocument = request => createDocument({client: request.client, data: request.data, collection: 'users'});

const createUserInFauna = requestData => did =>
    compose(
        map(passThrough(response => logger.debug(`Created User In Fauna: ${deepInspect(response.data)}.`))),
        flatMap(client => createUserDocument({ client: client, data: { did: did, userName: requestData.userName } })),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

const createUser = requestData => did =>
    createUserInFauna(requestData)(did)()
    .trigger
    (error =>
        isEqual('Creating Fauna Document: BadRequest: instance not unique')(error + '')
        ? ({statusCode: 409, body: JSON.stringify({reason: 'This user already exists. Please sign in.'})})
        : logger.error(`User creation: ${error}`) && ({statusCode: 500, body: 'Internal Error'})
    )
    (() => ({statusCode: 200, body: JSON.stringify({userName: requestData.userName})}));

export {
    createUser
};