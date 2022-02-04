import { eitherToAsyncEffect, mergeAsyncEffects, map, flatMap, compose, identity } from '@7urtle/lambda';

import logger from './src/logger.js';
import { createIndexIfItDoesntExist, createCollectionIfItDoesntExist, getClient, getFaunaSecretFromEnv } from './effects/Fauna.js';

const createNewCollection = name => client => createCollectionIfItDoesntExist({client: client, params: { name: name }});
const createAuthenticationsCollection = createNewCollection('authentications');
const createUsersCollection = createNewCollection('users');
const createChallengesCollection = createNewCollection('challenges');
const createAllCollections = client =>
    mergeAsyncEffects(
        createAuthenticationsCollection(client),
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
const createAuthenticationsByChallengeIDIndex = client => createIndexIfItDoesntExist({
    client: client,
    name: 'authentications_by_challengeid',
    source: 'authentications',
    params: {
        terms: [ { field: ['data', 'challengeId'] } ],
        unique: true,
        serialized: true
    }
});
const createChallengesByChallengeIDIndex = client => createIndexIfItDoesntExist({
    client: client,
    name: 'challenges_by_challengeid',
    source: 'challenges',
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
        createAuthenticationsByChallengeIDIndex(client),
        createChallengesByChallengeIDIndex(client)
    );

const createCollectionsAndIndexes = client =>
    compose(
        map(() => logger.info(`Created Indexes In Fauna.`)),
        flatMap(() => createAllIndexes(client)),
        map(() => logger.info(`Created Collections In Fauna.`)),
        () => createAllCollections(client),
    )();

const setupFauna =
    compose(
        flatMap(createCollectionsAndIndexes),
        eitherToAsyncEffect,
        flatMap(getClient),
        getFaunaSecretFromEnv
    );

setupFauna()
.trigger
(logger.error)
(identity);