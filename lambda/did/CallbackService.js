import { map } from '@7urtle/lambda';

import logger from '../../src/logger';
import { Callback } from "../../effects/Callback";

const processCallback = request =>
    Callback(request)
    .trigger
    (errors => map(error => logger.error(`DID Callback: ${error}`))(errors) && ({
        statusCode: 404,
        body: 'Not Found'
    }))
    (() => ({
        statusCode: 204
    }));

export {
    processCallback
};