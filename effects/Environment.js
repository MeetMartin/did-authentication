import { isNothing, Failure, Success } from '@7urtle/lambda';

const getValueFromEnv = key =>
    isNothing(process.env[key])
    ? Failure(`Environment variable process.env.${key} is Nothing.`)
    : Success(process.env[key]);

export {
    getValueFromEnv
};