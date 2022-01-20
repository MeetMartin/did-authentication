import { passThrough, deepInspect, eitherToAsyncEffect, map, flatMap, compose, isEqual } from '@7urtle/lambda';

import logger from '../../src/logger';
import { getDocumentByIndex, getClient, getFaunaSecretFromEnv } from '../../effects/Fauna';

const getUserByDID = data => client =>
    getDocumentByIndex({
        client: client,
        data: data,
        index: 'users_by_did'
    });

const readUserFromFauna = did =>
    compose(
        map(passThrough(response => logger.debug(`Read User From Fauna: ${deepInspect(response.data)}.`))),
        flatMap(getUserByDID(did)),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

const readUser = did =>
    readUserFromFauna(did)()
    .trigger
    (error =>
        isEqual('Getting Fauna Record By Index: NotFound: instance not found')(error + '')
        ? ({statusCode: 200, body: JSON.stringify({reason: 'You are not a member yet. Please sign up first.'})})
        : logger.error(`User reading: ${error}`) && ({statusCode: 500, body: 'Internal Error'}))
    (response => ({statusCode: 200, body: JSON.stringify({userName: response.data.userName})}));

export {
    readUser
};