import { passThrough, deepInspect, eitherToAsyncEffect, map, flatMap, compose, isEqual } from '@7urtle/lambda';

import logger from '../../src/logger';
import { createRecord, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';

const createUserRecord = request => createRecord({client: request.client, data: request.data, collection: 'users'});

const createUserInFauna = requestData => did =>
    compose(
        map(passThrough(response => logger.debug(`Created User In Fauna: ${deepInspect(response.data)}.`))),
        flatMap(client => createUserRecord({ client: client, data: { did: did, userName: requestData.userName } })),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

const createUser = requestData => did =>
    createUserInFauna(requestData)(did)()
    .trigger
    (error =>
        isEqual('Creating Fauna Record: BadRequest: instance not unique')(error + '')
        ? ({statusCode: 409, body: JSON.stringify({reason: 'This user already exists. Please sign in.'})})
        : logger.error(`User creation: ${error}`) && ({statusCode: 500, body: 'Internal Error'})
    )
    (() => ({statusCode: 200, body: JSON.stringify({userName: requestData.userName})}));

export {
    createUser
};