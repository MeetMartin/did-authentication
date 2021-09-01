import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';

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
        ).then(resolve).catch(error => reject(`Requesting MATTR Acccess Token: ${error}`))
    );

export {
    requestMATTRAccessToken
};