// @ts-check

import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { formatError } from './utils.js';

/**
 * @typedef {object} CreatePresentationTemplatePayload
 * @property {string} tenant MATTR tenant
 * @property {string} accessToken MATTR platform access token string
 * @property {string} [name] convenience attribute for quickly determining the intended purpose of a created template
 * @property {string} [domain] the domain of the tenant being used
 * @property {[object]} [query] type of presentation: DIDAuth, QueryByExample, QueryByFrame
 */

/**
 * createPresentationTemplate creates a Presentation Request Template that defines which credentials are required for presentation.
 * This is used to create the actual Presentation Request, which is used by the Mobile Wallet to select which credential it should
 * display to the Holder, asking for confirmation to be used in the Presentation to be sent.
 * 
 * The domain value must always match the domain of the tenant being used. In MATTR Platform you may customize your domain
 * to represent you when you request is displayed in the Mobile Wallet app.
 * 
 * Uses MATTR platform /v1/presentations/templates.
 * 
 * @pure
 * @HindleyMilner createPresentationTemplate :: CreatePresentationTemplatePayload -> AsyncEffect
 * @param {CreatePresentationTemplatePayload} payload 
 * @returns {AsyncEffect}
 */
const createPresentationTemplate = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload) && reject('createPresentationTemplate payload is Nothing.')) ||
        (isNothing(payload.tenant) && reject('createPresentationTemplate payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createPresentationTemplate payload.accessToken is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/presentations/templates`,
            {
                "name": payload.name || uuidv4(),
                "domain": payload.domain || payload.tenant,
                "query": payload.query || [
                    {
                        "type": "DIDAuth"
                    }
                ]
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        )
        .then(resolve)
        .catch(error => reject(`Creating Presentation Template: ${formatError(error)}`))
    );

/**
 * @typedef {object} CreatePresentationRequestPayload
 * @property {string} tenant MATTR tenant
 * @property {string} accessToken MATTR platform access token string
 * @property {string} challengeId Challenge ID used by your app to tie together the request and the callback response
 * @property {string} did verifier DID
 * @property {string} templateId presentation template ID
 * @property {string} callbackURL callback URL that MATTR platform will call with the request result
 * @property {number} [expiresTime] Unix timestamp in ms after which the request will be expired, 5 minutes default
 */

/**
 * createPresentationRequest creates a short lived Presentation Request.
 * 
 * Uses MATTR platform /v1/presentations/requests.
 * 
 * @pure
 * @HindleyMilner createPresentationRequest :: CreatePresentationRequestPayload -> AsyncEffect
 * @param {CreatePresentationRequestPayload} payload 
 * @returns {AsyncEffect}
 */
const createPresentationRequest = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload) && reject('createPresentationRequest payload is Nothing.')) ||
        (isNothing(payload.tenant) && reject('createPresentationRequest payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createPresentationRequest payload.accessToken is Nothing.')) ||
        (isNothing(payload.challengeId) && reject('createPresentationRequest payload.challengeId is Nothing.')) ||
        (isNothing(payload.did) && reject('createPresentationRequest payload.did is Nothing.')) ||
        (isNothing(payload.templateId) && reject('createPresentationRequest payload.templateId is Nothing.')) ||
        (isNothing(payload.callbackURL) && reject('createPresentationRequest payload.callbackURL is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/presentations/requests`,
            {
                "challenge": payload.challengeId,
                "did": payload.did,
                "templateId": payload.templateId,
                "expiresTime": payload.expiresTime || Math.round((new Date()).getTime()) + 300000,
                "callbackUrl": payload.callbackURL
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        )
        .then(resolve)
        .catch(error => reject(`Creating Presentation Request: ${formatError(error)}`))
    );

export {
    createPresentationTemplate,
    createPresentationRequest
};