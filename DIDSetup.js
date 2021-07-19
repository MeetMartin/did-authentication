import { AsyncEffect, Maybe, maybe, map, liftA2 } from '@7urtle/lambda';
import axios from 'axios';

import logger from './src/logger';

const getValueFromEnv = key => Maybe.of(process.env[key]);

const getMATTRAuthorize = liftA2(client_id => client_secret =>
    AsyncEffect
    .ofPromise(
        axios.post(
            'https://auth.mattr.global/oauth/token',
            {
                "client_id": client_id,
                "client_secret": client_secret,
                "audience": "https://vii.mattr.global",
                "grant_type": "client_credentials"
            }
        )
    )
);

const getAccessToken = response => Maybe.of(response.data?.access_token);

maybe
(() => logger.error('CLIENT_ID or CLIENT_SECRET are not defined or empty within .env.'))
(token => map(getAccessToken)(token).trigger(logger.error)(result => console.log('Your MATTR access token is ', result.value)))
(getMATTRAuthorize
    (getValueFromEnv('CLIENT_ID'))
    (getValueFromEnv('CLIENT_SECRET'))
);