import { maybe, liftA2 } from '@7urtle/lambda';

import logger from '../src/logger';
import { getValueFromEnv } from './utils';
import { getMATTRAccessToken } from './MATTR';
import { getKeyDID } from './KeyDID';
import { getPresentationTemplateID } from './PresentationTemplate';

/**
 * triggerVerifierDID accepts Maybe of MATTR access token, reads TENANT from environment variable, and executes AsyncEffect
 * to create and print out to console a new verified key DID.
 *
 * @HindleyMilner triggerVerifierDID :: Maybe -> Promise
 *
 * @impure depends on process.env, executes async server requests, and writes into console
 * @param {Maybe} tokenMaybe
 * @return {Promise}
 *
 * @example
 * triggerVerifierDID(Maybe.of('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqaEROemRDUlVKRVEwTTVSVFE0TmtZME9UZzVNVEpDTlVJNFJqRTBPREExTmpZMk1qazFPQSJ9.eyJodHRwOi8vbWF0dHIvdGVuYW50LWlkIjoiNTMyOTdmYmItOGY0OS00YWNhLWI2MTUtNGFjZWMwZTI2YmQ5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hdHRyLmdsb2JhbC8iLCJzdWIiOiJPY3gxWDJ4d0lEQ2hZbkVHQTRTeEZjUk9EWEN3QzM1U0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly92aWkubWF0dHIuZ2xvYmFsIiwiaWF0IjoxNjI2ODIwNTQzLCJleHAiOjE2MjY4MzQ5NDMsImF6cCI6Ik9jeDFYMnh3SURDaFluRUdBNFN4RmNST0RYQ3dDMzVTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.B2JESnoWviGCc_0YYmSyp1qvBS8kbE-t9qA02MzDXNNXLWR-KlTG1ed_xD3NKRGakj__K8TcpFUEzOJF9uLIQxGoq8Qxh4jeN_fgpJlD9SUgwLNwsWzAoDxFEFeOw3xSEnSF17QtxVxPdUl5ZzLVdGHAf4QogY_la-3aGefEtf9dbhPUUCTagJ_KDoLDPoWX004LQPrG19qoXlo5W-3aPnTw1xRdDrf50XKWELlLRHnpAeChX1SpOZl-UbXoz3nOBmdf64BPClEEXiMg16AQInjSMTfyaWh4qNjOQgdpFtMoK-9lhc_0fC35urXk3FitZMCAXCXSnNtX6K1eC6dpNR'));
 * // => Promise
 */
const triggerVerifierDID = tokenMaybe =>
    maybe
    (() => logger.error('triggerVerifierDID TENANT is Nothing in the .env or Access Token is Nothing.'))
    (DIDEffect =>
        DIDEffect
        .trigger
        (error => logger.error(`triggerVerifierDID ${error}`))
        (maybe
            (() => logger.error('Result verifier DID is Nothing.'))
            (result => logger.info('VERIFIERDID=' + result))
        )
    )
    (liftA2
        (getKeyDID)
        (getValueFromEnv('TENANT'))
        (tokenMaybe)
    );

/**
 * triggerPresentationTemplateID accepts Maybe of MATTR access token, reads TENANT from environment variable, and executes AsyncEffect
 * to create and print out to console a new presentation template ID.
 *
 * @HindleyMilner triggerPresentationTemplateID :: Maybe -> Promise
 *
 * @impure depends on process.env, executes async server requests, and writes into console
 * @param {Maybe} tokenMaybe
 * @return {Promise}
 *
 * @example
 * triggerPresentationTemplateID(Maybe.of('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqaEROemRDUlVKRVEwTTVSVFE0TmtZME9UZzVNVEpDTlVJNFJqRTBPREExTmpZMk1qazFPQSJ9.eyJodHRwOi8vbWF0dHIvdGVuYW50LWlkIjoiNTMyOTdmYmItOGY0OS00YWNhLWI2MTUtNGFjZWMwZTI2YmQ5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hdHRyLmdsb2JhbC8iLCJzdWIiOiJPY3gxWDJ4d0lEQ2hZbkVHQTRTeEZjUk9EWEN3QzM1U0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly92aWkubWF0dHIuZ2xvYmFsIiwiaWF0IjoxNjI2ODIwNTQzLCJleHAiOjE2MjY4MzQ5NDMsImF6cCI6Ik9jeDFYMnh3SURDaFluRUdBNFN4RmNST0RYQ3dDMzVTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.B2JESnoWviGCc_0YYmSyp1qvBS8kbE-t9qA02MzDXNNXLWR-KlTG1ed_xD3NKRGakj__K8TcpFUEzOJF9uLIQxGoq8Qxh4jeN_fgpJlD9SUgwLNwsWzAoDxFEFeOw3xSEnSF17QtxVxPdUl5ZzLVdGHAf4QogY_la-3aGefEtf9dbhPUUCTagJ_KDoLDPoWX004LQPrG19qoXlo5W-3aPnTw1xRdDrf50XKWELlLRHnpAeChX1SpOZl-UbXoz3nOBmdf64BPClEEXiMg16AQInjSMTfyaWh4qNjOQgdpFtMoK-9lhc_0fC35urXk3FitZMCAXCXSnNtX6K1eC6dpNR'));
 * // => Promise
 */
const triggerPresentationTemplateID = tokenMaybe =>
    maybe
    (() => logger.error('triggerPresentationTemplateID TENANT is nothing in the .env or Access Token is Nothing.'))
    (DIDEffect =>
        DIDEffect
        .trigger
        (error => logger.error(`triggerPresentationTemplateID ${error}`))
        (maybe
            (() => logger.error('Result Presentation Template ID is Nothing.'))
            (result => logger.info('TEMPLATEID=' + result))
        )
    )
    (liftA2
        (getPresentationTemplateID)
        (getValueFromEnv('TENANT'))
        (tokenMaybe)
    );

/**
 * trigger reads CLIENT_ID and CLIENT_SECRET from environment variables, and executes code to print out
 * to console a new verified key DID and a new presentation template ID.
 *
 * @HindleyMilner getPresentationTemplateID :: () -> Promise
 *
 * @impure depends on process.env, executes async server requests, and writes into console
 * @return {Promise}
 *
 * @example
 * trigger();
 * // => Promise
 */
const trigger = () =>
    maybe
    (() => logger.error('trigger CLIENT_ID or CLIENT_SECRET are Nothing within .env.'))
    (TokenEffect =>
        TokenEffect
        .trigger
        (error => logger.error(`trigger ${error}`))
        (tokenMaybe =>
            triggerVerifierDID(tokenMaybe) &&
            triggerPresentationTemplateID(tokenMaybe) &&
            logger.info('Save these as environment variables.\n These remain the same in local .env as well as in a production environment.')
        )
    )
    (liftA2
        (getMATTRAccessToken)
        (getValueFromEnv('CLIENT_ID'))
        (getValueFromEnv('CLIENT_SECRET'))
    );

trigger(); // executes this script