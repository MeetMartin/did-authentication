import { eitherToAsyncEffect, flatMap, compose } from '@7urtle/lambda';

import logger from '../../src/logger';
import { deleteRecordByIndex, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';

const deleteUserByDID = data => client =>
    deleteRecordByIndex({
        client: client,
        data: data,
        index: 'users_by_did'
    });

const deleteUserFromFauna = did =>
    compose(
        flatMap(deleteUserByDID(did)),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

const deleteUser = did =>
    deleteUserFromFauna(did)()
    .trigger
    (error => logger.error(`User deletion: ${error}`) && ({statusCode: 500, body: 'Internal Error'}))
    (response => ({statusCode: 200, body: JSON.stringify({userName: response.data.userName})}));

export {
    deleteUser
};