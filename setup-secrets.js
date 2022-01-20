import crypto from 'crypto';

import logger from './src/logger';

logger.info('Setting up secrets for your environment.');

const JWTSecret = crypto.randomBytes(32).toString('base64');
const initVector = crypto.randomBytes(16).toString('base64');
const Securitykey = crypto.randomBytes(32).toString('base64');

logger.info(`

JWT_SECRET=${JWTSecret}
CRYPTO_IV=${initVector}
CRYPTO_KEY=${Securitykey}

Save these as environment variables.
`);