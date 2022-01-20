import { passThrough, eitherToAsyncEffect, mergeAsyncEffects, map, flatMap, compose, identity } from '@7urtle/lambda';

import logger from './src/logger';
import { createIndexIfItDoesntExist, createCollectionIfItDoesntExist, getClient, getFaunaSecretFromEnv } from './effects/Fauna';

const createNewCollection = name => client => createCollectionIfItDoesntExist({client: client, params: { name: name }});
const createSigninsCollection = createNewCollection('signins');
const createUsersCollection = createNewCollection('users');
const createChallengesCollection = createNewCollection('challenges');
const createAllCollections = client =>
    mergeAsyncEffects(
        createSigninsCollection(client),
        createUsersCollection(client),
        createChallengesCollection(client)
    );

const createDIDByUsernameIndex = client => createIndexIfItDoesntExist({
    client: client,
    name: 'did_by_username',
    source: 'users',
    params: {
        terms: [ { field: ['data', 'userName'] } ],
        unique: true,
        serialized: true
    }
});
const createUsersByDIDIndex = client => createIndexIfItDoesntExist({
    client: client,
    name: 'users_by_did',
    source: 'users',
    params: {
        terms: [ { field: ['data', 'did'] } ],
        unique: true,
        serialized: true
    }
});
const createSigninsByChallengIDIndex = client => createIndexIfItDoesntExist({
    client: client,
    name: 'signins_by_challengeid',
    source: 'signins',
    params: {
        terms: [ { field: ['data', 'challengeId'] } ],
        unique: true,
        serialized: true
    }
});
const createAllIndexes = client =>
    mergeAsyncEffects(
        createDIDByUsernameIndex(client),
        createUsersByDIDIndex(client),
        createSigninsByChallengIDIndex(client)
    );

const createCollectionsAndIndexes = client =>
    compose(
        map(data => logger.info(`Created Indexes In Fauna: ${data}.`)),
        flatMap(() => createAllIndexes(client)),
        map(data => logger.info(`Created Collections In Fauna: ${data}.`)),
        () => createAllCollections(client),
    )();

const setupFauna =
    compose(
        map(passThrough(() => logger.info(`Created Collections and Indexes In Fauna.`))),
        flatMap(createCollectionsAndIndexes),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

setupFauna()
.trigger
(logger.error)
(identity);