import { isNothing, compose, map, flatMap, eitherToAsyncEffect, mergeEithers, mergeAsyncEffects } from '@7urtle/lambda';

import logger from './src/logger';
import { getValueFromEnv } from './effects/Environment';
import { requestMATTRAccessToken } from './effects/MATTR';
import { createDID } from './effects/DID';
import { createPresentationTemplate } from './effects/Presentation';

const getEnvironmentVariables = () =>
    mergeEithers(
        getValueFromEnv('CLIENT_ID'),
        getValueFromEnv('CLIENT_SECRET'),
        getValueFromEnv('TENANT')
    );

const envListToObject = list => ({
    clientId: list[0],
    clientSecret: list[1],
    tenant: list[2]
});

const getInputVariables =
    compose(
        map(envListToObject),
        getEnvironmentVariables
    );

const getDIDs = request =>
    mergeAsyncEffects(
        createDID(request),
        createPresentationTemplate(request)
    );

const getPresentationTemplateAndVerifierDID = env =>
    compose(
        map(responses => [responses[0].data.did, responses[1].data.id]),
        flatMap(token => getDIDs({tenant: env.tenant, accessToken: token})),
        map(response => response.data?.access_token),
        () => requestMATTRAccessToken({clientId: env.clientId, clientSecret: env.clientSecret})
    )();

const main =
    compose(
        flatMap(getPresentationTemplateAndVerifierDID),
        eitherToAsyncEffect,
        getInputVariables
    );

main()
.trigger
(map(logger.error))
(result =>
    (isNothing(result[0]) && logger.error('No DID found in the server response.')) ||
    (isNothing(result[1]) && logger.error('No Template ID found in the server response.')) ||
    logger.info(`
VERIFIER_DID=${result[0]}
TEMPLATE_ID=${result[1]}
Save these as environment variables.
`));