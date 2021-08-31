import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';
import shortid from 'shortid';

/**
 * createPresentationTemplate returns AsyncEffect of Presentation Template request to MATTR that returns Presentation Template.
 *
 * @HindleyMilner readPresentationTemplateID :: object -> AsyncEffect
 *
 * @pure
 * @param {object} payload
 * @return {AsyncEffect}
 *
 * @example
 * createPresentationTemplate({
 *  tenant: 'tenant.vii.mattr.global',
 *  accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqaEROemRDUlVKRVEwTTVSVFE0TmtZME9UZzVNVEpDTlVJNFJqRTBPREExTmpZMk1qazFPQSJ9.eyJodHRwOi8vbWF0dHIvdGVuYW50LWlkIjoiNTMyOTdmYmItOGY0OS00YWNhLWI2MTUtNGFjZWMwZTI2YmQ5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hdHRyLmdsb2JhbC8iLCJzdWIiOiJPY3gxWDJ4d0lEQ2hZbkVHQTRTeEZjUk9EWEN3QzM1U0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly92aWkubWF0dHIuZ2xvYmFsIiwiaWF0IjoxNjI2ODIwNTQzLCJleHAiOjE2MjY4MzQ5NDMsImF6cCI6Ik9jeDFYMnh3SURDaFluRUdBNFN4RmNST0RYQ3dDMzVTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.B2JESnoWviGCc_0YYmSyp1qvBS8kbE-t9qA02MzDXNNXLWR-KlTG1ed_xD3NKRGakj__K8TcpFUEzOJF9uLIQxGoq8Qxh4jeN_fgpJlD9SUgwLNwsWzAoDxFEFeOw3xSEnSF17QtxVxPdUl5ZzLVdGHAf4QogY_la-3aGefEtf9dbhPUUCTagJ_KDoLDPoWX004LQPrG19qoXlo5W-3aPnTw1xRdDrf50XKWELlLRHnpAeChX1SpOZl-UbXoz3nOBmdf64BPClEEXiMg16AQInjSMTfyaWh4qNjOQgdpFtMoK-9lhc_0fC35urXk3FitZMCAXCXSnNtX6K1eC6dpNR'
 * });
 */
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
        ).then(resolve).catch(error => reject(`Creating Presentation Template: ${error}`))
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
        ).then(resolve).catch(error => reject(`Creating Presentation Request: ${error}`))
    );

export {
    createPresentationTemplate,
    createPresentationRequest
};