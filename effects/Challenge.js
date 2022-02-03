import { passThrough, map, flatMap, compose, eitherToAsyncEffect, deepInspect } from '@7urtle/lambda';

import { getDocumentByIndex, createDocument, getClient, getFaunaSecretFromEnv } from './Fauna.js';
import logger from '../src/logger.js';

const saveChallenge = request =>
    compose(
        map(() => request),
        map(passThrough(() => logger.debug(`Stored Challenge in Fauna: ${deepInspect({ requestId: request.requestId, challengeId: request.challengeId })}.`))),
        flatMap(client => createDocument({client: client, data: { requestId: request.requestId, challengeId: request.challengeId }, collection: 'challenges'})),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    )();

const getChallenge = challengeId =>
    compose(
        map(passThrough(data => logger.debug(`Found Challenge in Fauna: ${deepInspect(data)}.`))),
        map(result => result.data),
        flatMap(client => getDocumentByIndex({ client: client, data: challengeId, index: 'challenges_by_challengeid' })),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    )();    

export {
    saveChallenge,
    getChallenge
};