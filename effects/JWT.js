/*
Brave developer,

Please don't use this solution to manage your JWT in a real production environment.

This approach was used to simplify the repository setup for people interested in
distributed identifier authentication. However, the authorization approach using JWT
is intentionally simplified.

- Martin
*/
import { Either } from '@7urtle/lambda';
import jwt from 'jsonwebtoken';

import { getValueFromEnv } from './Environment';

const getJWTPrivateKeyFromEnv = () => getValueFromEnv('JWT_SECRET');

const sign = data => key => Either.try(() => jwt.sign(data, key));

const verify = token => key => Either.try(() => jwt.verify(token, key));

export {
    getJWTPrivateKeyFromEnv,
    sign,
    verify
};