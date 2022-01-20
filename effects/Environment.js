import { isNothing, Failure, Success, map } from '@7urtle/lambda';

const getValueFromEnv = key =>
    isNothing(process.env[key])
    ? Failure(`Environment variable process.env.${key} is Nothing.`)
    : Success(process.env[key]);

const getSecretFromEnv = secret =>
    map
    (value => Buffer.from(value, 'base64'))
    (getValueFromEnv(secret));

export {
    getValueFromEnv,
    getSecretFromEnv
};