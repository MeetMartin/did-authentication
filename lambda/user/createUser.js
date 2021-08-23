import { eitherToAsyncEffect, flatMap, compose, isEqual } from '@7urtle/lambda';

import logger from '../../src/logger';
import { createRecord, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';

const createUserRecord = request => createRecord({client: request.client, data: request.data, collection: 'users'});

const createUserInFauna = requestData => did =>
    compose(
        flatMap(client => createUserRecord({ client: client, data: { did: did, userName: requestData.userName } })),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

const createUser = requestData => did =>
    createUserInFauna(requestData)(did)()
    .trigger
    (error =>
        isEqual('BadRequest: instance not unique')(error + '')
        ? ({statusCode: 200, body: JSON.stringify({userName: requestData.userName})})
        : logger.error(`User creation: ${error}`) && ({statusCode: 500, body: 'Internal Error'})
    )
    (() => ({statusCode: 200, body: JSON.stringify({userName: requestData.userName})}));

export {
    createUser
};