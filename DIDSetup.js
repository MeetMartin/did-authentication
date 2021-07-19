import { AsyncEffect, Maybe, maybe, map, liftA2, flatMap, compose } from '@7urtle/lambda';
import axios from 'axios';

import logger from './src/logger';

// getValueFromEnv :: string -> Maybe(string)
const getValueFromEnv = key => Maybe.of(process.env[key]);

// getMATTRAuthorize :: string -> string -> AsyncEffect(object)
const getMATTRAuthorize = clientId => clientSecret =>
    AsyncEffect
    .ofPromise(
        axios.post(
            'https://auth.mattr.global/oauth/token',
            {
                "client_id": clientId,
                "client_secret": clientSecret,
                "audience": "https://vii.mattr.global",
                "grant_type": "client_credentials"
            }
        )
    );

// getAccessToken :: object -> Maybe(string)
const getAccessToken = response => Maybe.of(response.data?.access_token);

// getKeyDID :: string -> string -> AsyncEffect(object)
const getKeyDID = tenant => accessToken =>
    AsyncEffect
    .ofPromise(
        axios.post(
            `https://${tenant}/v1/dids`,
            {
                "method": "key"
            },
            {
                "Authorization": `Bearer ${accessToken}`
            }
        )
    );

maybe
(() => logger.error('CLIENT_ID or CLIENT_SECRET are not defined or empty within .env.'))
(token => map(getAccessToken)(token).trigger(logger.error)(result => console.log('Your MATTR access token is ', result.value)))
(liftA2
    (getMATTRAuthorize)
    (getValueFromEnv('CLIENT_ID'))
    (getValueFromEnv('CLIENT_SECRET'))
);

/*liftA2
(getMATTRAuthorize)
(getValueFromEnv('CLIENT_ID'))
(getValueFromEnv('CLIENT_SECRET')) // Maybe(AsyncEffect(object))
.map(getAccessToken) // Maybe(AsyncEffect(Maybe(string)))
.map(map(liftA2(getKeyDID)(getValueFromEnv('TENANT')))) // Maybe(AsyncEffect(Maybe(AsyncEffect)))*/