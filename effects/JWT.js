import { AsyncEffect } from '@7urtle/lambda';
import jwt from 'jsonwebtoken';

const sign = data => key =>
    AsyncEffect
    .of(reject => resolve =>
        jwt.sign(data, key, { algorithm: 'RS256' }, (error, token) => error ? reject(error) : resolve(token))
    );

const verify = token => key =>
    AsyncEffect
    .of(reject => resolve =>
        jwt.verify(token, key, (error, data) => error ? reject(error) : resolve(data))
    );

export {
    sign,
    verify
};