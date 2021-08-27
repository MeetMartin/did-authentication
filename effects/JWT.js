import { Either } from '@7urtle/lambda';
import jwt from 'jsonwebtoken';

import { getValueFromEnv } from './Environment';

const getJWTPrivateKeyFromEnv = () => getValueFromEnv('JWT_PRIVATE_KEY');

const sign = data => key => Either.try(() => jwt.sign(data, key));

const verify = token => key => Either.try(() => jwt.verify(token, key));

export {
    getJWTPrivateKeyFromEnv,
    sign,
    verify
};