import { eitherToAsyncEffect, flatMap, compose, isEqual } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getRecordByIndex, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';

const getUserByDID = data => client =>
    getRecordByIndex({
        client: client,
        data: data,
        index: 'users_by_did'
    });

const readUserFromFauna = did =>
    compose(
        flatMap(getUserByDID(did)),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

const readUser = did =>
    readUserFromFauna(did)()
    .trigger
    (error =>
        isEqual('NotFound: instance not found')(error + '')
        ? ({statusCode: 200, body: JSON.stringify({reason: 'You are not a member yet. Please sign up first.'})})
        : logger.error(`User reading: ${error}`) && ({statusCode: 500, body: 'Internal Error'}))
    (response => ({statusCode: 200, body: JSON.stringify({userName: response.data.userName})}));

export {
    readUser
};