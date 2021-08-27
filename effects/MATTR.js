import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';

/**
 * requestMATTRAccessToken returns AsyncEffect of authorization request to MATTR that returns access token.
 *
 * @HindleyMilner getMATTRAccessToken :: object -> AsyncEffect
 *
 * @pure
 * @param {object} payload
 * @return {AsyncEffect}
 *
 * @example
 * requestMATTRAccessToken({
 *  clientId: 'Ocx1X2xwIDChYnEGA4SxFcRODXCwC35F',
 *  clientSecret: 'knyO3oDhuvnEpluCbjaZtNbnv4z1agQGkLFUUtW6c7LaPA0gJEdCEBErKSDJ4-Et'
 * });
 */
 const requestMATTRAccessToken = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload.clientId) && reject('requestMATTRAccessToken payload.clientId is Nothing.')) ||
        (isNothing(payload.clientSecret) && reject('requestMATTRAccessToken payload.clientSecret is Nothing.')) ||
        axios.post(
            'https://auth.mattr.global/oauth/token',
            {
                "client_id": payload.clientId,
                "client_secret": payload.clientSecret,
                "audience": "https://vii.mattr.global",
                "grant_type": "client_credentials"
            }
        ).then(resolve).catch(reject)
    );

 export {
    requestMATTRAccessToken
 };