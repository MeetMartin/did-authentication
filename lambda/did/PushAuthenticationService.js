import { isEqual, map } from '@7urtle/lambda';

import logger from '../../src/logger.js';
import { DIDPushAuthentication } from '../../effects/PushAuthentication.js';

const triggerPushAuthentication = request =>
    DIDPushAuthentication(request)
    .trigger
    (errors => map(error => logger.error(`DID Push Authentication: ${error}`))(errors) &&
        (isEqual('Getting Fauna Record By Index: NotFound: instance not found')(errors) &&
            ({
                statusCode: 401,
                body: JSON.stringify({authenticated: false, reason: 'This account does not exist. Please sign up first.'})
            })
        ) ||
        ({
            statusCode: 500,
            body: 'Internal Server Error'
        })
    )
    (() => ({
        statusCode: 204
    }));

export {
    triggerPushAuthentication
};