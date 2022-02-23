// @ts-check

import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';

import { formatError } from './utils.js';

/**
 * @typedef {object} CreateDIDPayload
 * @property {string} tenant MATTR tenant
 * @property {string} accessToken MATTR platform access token string
 * @property {string} [method] DID method: key, web, ion
 * @property {object} [options] Options for the given DID method
 */

/**
 * createDID takes a supported DID Method (default key) and generates keys and associated information
 * for a new DID and registers the DID Document if applicable.
 * 
 * Uses /v1/dids.
 * 
 * @pure
 * @HindleyMilner createDID :: CreateDIDPayload -> AsyncEffect
 * @param {CreateDIDPayload} payload
 * @returns {AsyncEffect}
 */
const createDID = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload) && reject('createDID payload is Nothing.')) ||
        (isNothing(payload.tenant) && reject('createDID payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createDID payload.accessToken is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/dids`,
            {
                "method": payload.method || "key",
                "options": payload.options || {}
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
        .catch(error => reject(`Creating DID: ${formatError(error)}`))
    );

/**
 * @typedef {object} ReadDIDPayload
 * @property {string} tenant MATTR tenant
 * @property {string} accessToken MATTR platform access token string
 * @property {string} did Decentralized Identifier under W3C standard
 */

/**
 * readDID resolves a DID. When the DID is retrieved by the DID provided in the request, the DID Document is also attempted
 * to be resolved by using the DID method and method identifier.
 * 
 * Uses /v1/dids/{did}.
 * 
 * @pure
 * @HindleyMilner readDID :: ReadDIDPayload -> AsyncEffect
 * @param {ReadDIDPayload} payload
 * @returns {AsyncEffect}
 */
const readDID = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload) && reject('readDID payload is Nothing.')) ||
        (isNothing(payload.tenant) && reject('readDID payload.tenant is Nothing.')) ||
        (isNothing(payload.did) && reject('readDID payload.did is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('readDID payload.accessToken is Nothing.')) ||
        axios.get(
            `https://${payload.tenant}/v1/dids/${payload.did}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        )
        .then(resolve)
        .catch(error => reject(`Reading DID: ${formatError(error)}`))
    );

export {
    createDID,
    readDID
};