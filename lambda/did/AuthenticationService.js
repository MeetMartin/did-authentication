import { map } from '@7urtle/lambda';

import logger from '../../src/logger';
import { DIDAuthentication } from '../../effects/Authentication';

const triggerAuthentication = id =>
    DIDAuthentication(id)
    .trigger
    (errors => map(error => logger.error(`DID Authentication: ${error}`))(errors) && ({
        statusCode: 500,
        body: 'Internal Server Error'
    }))
    (result => ({
        statusCode: 301,
        headers: {
            location: result
        }
    }));

export {
    triggerAuthentication
};