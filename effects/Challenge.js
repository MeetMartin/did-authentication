import { passThrough, map, flatMap, compose, eitherToAsyncEffect, deepInspect } from '@7urtle/lambda';
import shortid from 'shortid';

import { getDocumentByIndex, createDocument, getClient, getFaunaSecretFromEnv } from './Fauna.js';
import logger from '../src/logger.js';

const addChallengeSecretToInput = input =>
    (secret =>
        ({
            ...input,
            callbackURL: input.callbackURL + '/' + secret,
            challengeSecret: secret
        })
    )(shortid.generate());

const saveChallenge = request =>
    compose(
        map(() => request),
        map(passThrough(() => logger.debug(`Stored Challenge in Fauna: ${deepInspect({ challengeId: request.challengeId, challengeSecret: request.challengeSecret })}.`))),
        flatMap(client => createDocument({client: client, data: { challengeId: request.challengeId, challengeSecret: request.challengeSecret }, collection: 'challenges'})),
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
    addChallengeSecretToInput,
    saveChallenge,
    getChallenge
};