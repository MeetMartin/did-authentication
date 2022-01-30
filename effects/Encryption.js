import { map, flatMap, Either, mergeEithers, compose } from '@7urtle/lambda';
import crypto from 'crypto';

import { getSecretFromEnv } from './Environment';

// getSecrets :: () -> Either([string])
const getSecrets = () =>
    mergeEithers(
        getSecretFromEnv('CRYPTO_KEY'),
        getSecretFromEnv('CRYPTO_IV')
    );

// envListToObject :: [string] -> object
const envListToObject = secrets => ({
    key: secrets[0],
    initialVector: secrets[1]
});

// getEncryptionSecretsFromEnv :: ()  -> Either(object)
const getEncryptionSecretsFromEnv =
    compose(
        map(envListToObject),
        getSecrets,
    );

// getCipher :: object -> Either
const getCipher = secrets => Either.try(() => crypto.createCipheriv('aes-256-cbc', secrets.key, secrets.initialVector));
// cipherMessage :: string -> object -> Either
const cipherMessage = message => cipher =>
    Either.try(() => cipher.update(message, 'utf-8', 'base64') + cipher.final('base64'));

// getDecipher :: object -> Either
const getDecipher = secrets => Either.try(() => crypto.createDecipheriv('aes-256-cbc', secrets.key, secrets.initialVector));
// decipherMessage :: string -> object -> Either
const decipherMessage = encryptedMessage => decipher =>
    Either.try(() => decipher.update(encryptedMessage, 'base64', 'utf-8') + decipher.final('utf-8'));

// encrypt :: string -> object -> Either
const encrypt = message => secrets =>
    compose(
        flatMap(cipherMessage(message)),
        getCipher,
    )(secrets);

// decrypt :: string -> object -> Either
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