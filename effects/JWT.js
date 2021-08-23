import { isNothing, Either } from '@7urtle/lambda';
import jwt from 'jsonwebtoken';

const getJWTPrivateKeyFromEnv = () =>
    isNothing(process.env.JWT_PRIVATE_KEY)
    ? Either.Failure('process.env.JWT_PRIVATE_KEY is Nothing.')
    : Either.Success(process.env.JWT_PRIVATE_KEY);

const sign = data => key => Either.try(() => jwt.sign(data, key));

const verify = token => key => Either.try(() => jwt.verify(token, key));

export {
    getJWTPrivateKeyFromEnv,
    sign,
    verify
};