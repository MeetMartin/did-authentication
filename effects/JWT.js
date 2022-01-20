/*
Brave developer,

Please don't use this solution to manage your JWT in a real production environment.

This approach was used to simplify the repository setup for people interested in
distributed identifier authentication. However, the authorization approach using JWT
is intentionally simplified.

For proper approach to managing JWT, please have a look at my article:
https://betterprogramming.pub/jwt-ultimate-how-to-guide-with-best-practices-in-javascript-f7ba4c48dfbd.

- Martin
*/
import { Either } from '@7urtle/lambda';
import jwt from 'jsonwebtoken';

import { getSecretFromEnv } from './Environment';

const getJWTSecretFromEnv = () => getSecretFromEnv('JWT_SECRET');

const sign = data => key => Either.try(() => jwt.sign(data, key));

const verify = token => key => Either.try(() => jwt.verify(token, key));

export {
    getJWTSecretFromEnv,
    sign,
    verify
};