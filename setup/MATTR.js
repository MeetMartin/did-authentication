import { AsyncEffect, Maybe, map } from '@7urtle/lambda';
import axios from 'axios';

/**
 * getMATTRAccessToken returns AsyncEffect of authorization request to MATTR that returns Maybe of access token.
 *
 * @HindleyMilner getMATTRAccessToken :: string -> string -> AsyncEffect
 *
 * @pure
 * @param {string} clientId
 * @param {string} clientSecret
 * @return {AsyncEffect}
 *
 * @example
 * getMATTRAccessToken('Ocx1X2xwIDChYnEGA4SxFcRODXCwC35F')('knyO3oDhuvnEpluCbjaZtNbnv4z1agQGkLFUUtW6c7LaPA0gJEdCEBErKSDJ4-Et');
 * // => AsyncEffect.of(Maybe.of('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqaEROemRDUlVKRVEwTTVSVFE0TmtZME9UZzVNVEpDTlVJNFJqRTBPREExTmpZMk1qazFPQSJ9.eyJodHRwOi8vbWF0dHIvdGVuYW50LWlkIjoiNTMyOTdmYmItOGY0OS00YWNhLWI2MTUtNGFjZWMwZTI2YmQ5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hdHRyLmdsb2JhbC8iLCJzdWIiOiJPY3gxWDJ4d0lEQ2hZbkVHQTRTeEZjUk9EWEN3QzM1U0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly92aWkubWF0dHIuZ2xvYmFsIiwiaWF0IjoxNjI2ODIwNTQzLCJleHAiOjE2MjY4MzQ5NDMsImF6cCI6Ik9jeDFYMnh3SURDaFluRUdBNFN4RmNST0RYQ3dDMzVTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.B2JESnoWviGCc_0YYmSyp1qvBS8kbE-t9qA02MzDXNNXLWR-KlTG1ed_xD3NKRGakj__K8TcpFUEzOJF9uLIQxGoq8Qxh4jeN_fgpJlD9SUgwLNwsWzAoDxFEFeOw3xSEnSF17QtxVxPdUl5ZzLVdGHAf4QogY_la-3aGefEtf9dbhPUUCTagJ_KDoLDPoWX004LQPrG19qoXlo5W-3aPnTw1xRdDrf50XKWELlLRHnpAeChX1SpOZl-UbXoz3nOBmdf64BPClEEXiMg16AQInjSMTfyaWh4qNjOQgdpFtMoK-9lhc_0fC35urXk3FitZMCAXCXSnNtX6K1eC6dpNR'))
 */
 const getMATTRAccessToken = clientId => clientSecret =>
    map(response => Maybe.of(response.data?.access_token))
    (
        AsyncEffect
        .ofPromise(() =>
            axios.post(
                'https://auth.mattr.global/oauth/token',
                {
                    "client_id": clientId,
                    "client_secret": clientSecret,
                    "audience": "https://vii.mattr.global",
                    "grant_type": "client_credentials"
                }
            )
        )
    );

 export {
    getMATTRAccessToken
 };