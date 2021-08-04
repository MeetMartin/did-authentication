import { AsyncEffect, Maybe, map } from '@7urtle/lambda';
import axios from 'axios';
import shortid from 'shortid';

import { getHeaders } from './utils';

/**
 * getPresentationTemplate returns AsyncEffect of Presentation Template request to MATTR that returns Maybe of Presentation Template ID.
 *
 * @HindleyMilner getPresentationTemplate :: string -> string -> AsyncEffect
 *
 * @pure
 * @param {string} tenant
 * @param {string} accessToken
 * @return {AsyncEffect}
 *
 * @example
 * getPresentationTemplate('tenant.vii.mattr.global')('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqaEROemRDUlVKRVEwTTVSVFE0TmtZME9UZzVNVEpDTlVJNFJqRTBPREExTmpZMk1qazFPQSJ9.eyJodHRwOi8vbWF0dHIvdGVuYW50LWlkIjoiNTMyOTdmYmItOGY0OS00YWNhLWI2MTUtNGFjZWMwZTI2YmQ5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hdHRyLmdsb2JhbC8iLCJzdWIiOiJPY3gxWDJ4d0lEQ2hZbkVHQTRTeEZjUk9EWEN3QzM1U0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly92aWkubWF0dHIuZ2xvYmFsIiwiaWF0IjoxNjI2ODIwNTQzLCJleHAiOjE2MjY4MzQ5NDMsImF6cCI6Ik9jeDFYMnh3SURDaFluRUdBNFN4RmNST0RYQ3dDMzVTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.B2JESnoWviGCc_0YYmSyp1qvBS8kbE-t9qA02MzDXNNXLWR-KlTG1ed_xD3NKRGakj__K8TcpFUEzOJF9uLIQxGoq8Qxh4jeN_fgpJlD9SUgwLNwsWzAoDxFEFeOw3xSEnSF17QtxVxPdUl5ZzLVdGHAf4QogY_la-3aGefEtf9dbhPUUCTagJ_KDoLDPoWX004LQPrG19qoXlo5W-3aPnTw1xRdDrf50XKWELlLRHnpAeChX1SpOZl-UbXoz3nOBmdf64BPClEEXiMg16AQInjSMTfyaWh4qNjOQgdpFtMoK-9lhc_0fC35urXk3FitZMCAXCXSnNtX6K1eC6dpNR');
 * // => AsyncEffect.of(Maybe.of('a934aa42-b51f-4c88-8d03-eb8a048b0a77'))
 */
 const getPresentationTemplateID = tenant => accessToken =>
    map(response => Maybe.of(response.data?.id))
    (
        AsyncEffect
        .ofPromise(() =>
            axios.post(
                `https://${tenant}/v1/presentations/templates`,
                {
                    "name": `did-presentation-${shortid.generate()}`, // adding ID in case that we want to run this script repeatedly
                    "domain": tenant,
                    "query": [
                        {
                            "type": "DIDAuth"
                        }
                    ]
                },
                getHeaders(accessToken)
            )
        )
    );

export {
    getPresentationTemplateID
};