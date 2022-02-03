import { passThrough, deepInspect, map, flatMap, compose, isNothing, Either, Failure, Success, mergeEithers, eitherToAsyncEffect } from '@7urtle/lambda';
import { authentication } from 'didauth';
import { nanoid } from 'nanoid';

import logger from '../src/logger.js';
import { getValueFromEnv } from './Environment.js';
import { saveChallenge } from './Challenge.js';

const getId = requestId => isNothing(requestId) ? Failure('ID url path is Nothing.') : Success(requestId);
const getCallbackURL = () =>
    (
        map
        (url => `${url}/did/callback`)
        (getValueFromEnv('ngrok'))
    )
    .orElse(() => getValueFromEnv('DIDAUTH_CALLBACK_URL'));

const getVariables = requestId =>
    mergeEithers(
        getValueFromEnv('MATTR_CLIENT_ID'),
        getValueFromEnv('MATTR_CLIENT_SECRET'),
        getValueFromEnv('MATTR_TENANT'),
        getValueFromEnv('PRESENTATION_TEMPLATE_ID'),
        getValueFromEnv('VERIFIER_DID'),
        getCallbackURL(),
        getId(requestId),
        Either.try(nanoid)
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2],
    templateId: list[3],
    did: list[4],
    callbackURL: list[5],
    requestId: list[6],
    challengeId: list[7]
});

const getInputVariables =
    compose(
        map(envListToObject),
        getVariables
    );

const DIDAuthentication = requestId =>
    compose(
        map(passThrough(url => logger.debug(`DID Authentication Redirect URL: ${deepInspect(url)}`))),
        flatMap(authentication),
        flatMap(saveChallenge),
        eitherToAsyncEffect,
        map(passThrough(input => logger.debug(`DID Authentication Input Variables: ${deepInspect(input)}`))),
        getInputVariables,
    )(requestId);

export {
    DIDAuthentication
};