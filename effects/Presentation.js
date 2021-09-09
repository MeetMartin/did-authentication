import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';
import shortid from 'shortid';

import { processMATTRError } from './MATTR';

const createPresentationTemplate = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload.tenant) && reject('createPresentationTemplate payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createPresentationTemplate payload.accessToken is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/presentations/templates`,
            {
                "name": shortid.generate(),
                "domain": payload.tenant,
                "query": [
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
        ).then(resolve).catch(error => reject(`Creating Presentation Template: ${processMATTRError(error)}`))
    );

const createPresentationRequest = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload.tenant) && reject('createPresentationRequest payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createPresentationRequest payload.accessToken is Nothing.')) ||
        (isNothing(payload.requestId) && reject('createPresentationRequest payload.requestId is Nothing.')) ||
        (isNothing(payload.did) && reject('createPresentationRequest payload.did is Nothing.')) ||
        (isNothing(payload.templateId) && reject('createPresentationRequest payload.templateId is Nothing.')) ||
        (isNothing(payload.presentationCallbackURL) && reject('createPresentationRequest payload.presentationCallbackURL is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/presentations/requests`,
            {
                "challenge": payload.requestId,
                "did": payload.did,
                "templateId": payload.templateId,
                "expiresTime": 1638836401000,
                "callbackUrl": payload.presentationCallbackURL
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        ).then(resolve).catch(error => reject(`Creating Presentation Request: ${processMATTRError(error)}`))
    );

export {
    createPresentationTemplate,
    createPresentationRequest
};