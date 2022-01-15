import { passThrough, deepInspect, map, flatMap, compose, isNothing, Failure, Success, mergeEithers, eitherToAsyncEffect } from '@7urtle/lambda';
import { authentication } from 'didauth';

import logger from '../src/logger';
import { getValueFromEnv } from './Environment';

const getId = id => isNothing(id) ? Failure('ID url path is Nothing.') : Success(id);

const getVariables = id =>
    mergeEithers(
        getValueFromEnv('MATTR_CLIENT_ID'),
        getValueFromEnv('MATTR_CLIENT_SECRET'),
        getValueFromEnv('MATTR_TENANT'),
        getValueFromEnv('PRESENTATION_TEMPLATE_ID'),
        getValueFromEnv('VERIFIER_DID'),
        (map(url => `${url}/did/callback`)(getValueFromEnv('ngrok')))
        .orElse(() => getValueFromEnv('DIDAUTH_CALLBACK_URL')),
        getId(id)
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2],
    templateId: list[3],
    did: list[4],
    callbackURL: list[5],
    challengeId: list[6]
});

const getInputVariables =
    compose(
        map(envListToObject),
        getVariables
    );

const DIDAuthentication = id =>
    compose(
        map(passThrough(url => logger.debug(`DID Authentication Redirect URL: ${deepInspect(url)}`))),
        flatMap(authentication),
        eitherToAsyncEffect,
        map(passThrough(input => logger.debug(`DID Authentication Input Variables: ${deepInspect(input)}`))),
        getInputVariables,
    )(id);

export {
    DIDAuthentication
};