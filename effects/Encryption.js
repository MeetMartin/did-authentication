import { map, flatMap, Either, mergeEithers, compose } from '@7urtle/lambda';
import crypto from 'crypto';

import { getSecretFromEnv } from './Environment';

const getSecrets = () =>
    mergeEithers(
        getSecretFromEnv('CRYPTO_KEY'),
        getSecretFromEnv('CRYPTO_IV')
    );

const envListToObject = secrets => ({
    key: secrets[0],
    initialVector: secrets[1]
});

const getEncryptionSecretsFromEnv =
    compose(
        map(envListToObject),
        getSecrets,
    );

const getCipher = secrets => Either.try(() => crypto.createCipheriv('aes-256-cbc', secrets.key, secrets.initialVector));
const cipherMessage = message => cipher =>
    Either.try(() => cipher.update(message, 'utf-8', 'base64') + cipher.final('base64'));

const getDecipher = secrets => Either.try(() => crypto.createDecipheriv('aes-256-cbc', secrets.key, secrets.initialVector));
const decipherMessage = encryptedMessage => decipher =>
    Either.try(() => decipher.update(encryptedMessage, 'base64', 'utf-8') + decipher.final('utf-8'));

const encrypt = message => secrets =>
    compose(
        flatMap(cipherMessage(message)),
        getCipher,
    )(secrets);

const decrypt = encryptedMessage => secrets =>
    compose(
        flatMap(decipherMessage(encryptedMessage)),
        getDecipher,
    )(secrets);

export {
    getEncryptionSecretsFromEnv,
    encrypt,
    decrypt
};