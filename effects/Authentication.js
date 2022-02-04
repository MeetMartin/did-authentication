import { passThrough, deepInspect, map, flatMap, compose, isNothing, Either, Failure, Success, mergeEithers, eitherToAsyncEffect } from '@7urtle/lambda';
import { authentication } from 'didauth';
import { nanoid } from 'nanoid';

import logger from '../src/logger.js';
import { getValueFromEnv } from './Environment.js';
import { saveChallenge } from './Challenge.js';

const getId = challengeId => isNothing(challengeId) ? Failure('ID url path is Nothing.') : Success(challengeId);
const getCallbackURL = () =>
    (
        map
        (url => `${url}/did/callback`)
        (getValueFromEnv('ngrok'))
    )
    .orElse(() => getValueFromEnv('DIDAUTH_CALLBACK_URL'));

const getVariables = challengeId =>
    mergeEithers(
        getValueFromEnv('MATTR_CLIENT_ID'),
        getValueFromEnv('MATTR_CLIENT_SECRET'),
        getValueFromEnv('MATTR_TENANT'),
        getValueFromEnv('PRESENTATION_TEMPLATE_ID'),
        getValueFromEnv('VERIFIER_DID'),
        getCallbackURL(),
        getId(challengeId),
        Either.try(nanoid)
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2],
    templateId: list[3],
    did: list[4],
    callbackURL: list[5],
    challengeId: list[6],
    challengeSecret: list[7]
});

const getInputVariables =
    compose(
        map(inputs => ({ ...inputs, callbackURL: inputs.callbackURL + '/' + inputs.challengeSecret })),
        map(envListToObject),
        getVariables
    );

const DIDAuthentication = challengeId =>
    compose(
        map(passThrough(url => logger.debug(`DID Authentication Redirect URL: ${deepInspect(url)}`))),
        flatMap(authentication),
        flatMap(saveChallenge),
        eitherToAsyncEffect,
        map(passThrough(input => logger.debug(`DID Authentication Input Variables: ${deepInspect(input)}`))),
        getInputVariables,
    )(challengeId);

export {
    DIDAuthentication
};