import { isArray, isUndefined, map } from '@7urtle/lambda';

import logger from '../../src/logger.js';
import { checkAuthenticationStatus } from "../../effects/Status.js";

const statusErrorToReasonMap = new Map([
    ['Getting Fauna Record By Index: NotFound: instance not found', 'You did not scan the QR code using the wallet.'],
    ['Authentication age is Nothing or more than 5 minutes.', 'Authentication was verified through wallet more than 5 minutes ago. Reload the page.']
]);

const statusErrorToReason = error =>
    (reason =>
        isUndefined(reason)
        ? 'Unknown issue.'
        : reason
    )(
        isArray(error)
        ? statusErrorToReasonMap.get(error[0] + '')
        : statusErrorToReasonMap.get(error + '')
    );

const checkStatus = request =>
    checkAuthenticationStatus(request)
    .trigger
    (errors => map(error => logger.error(`Authentication status: ${error}`))(errors) &&
        ({statusCode: 200, body: JSON.stringify({ verified: false, reason: statusErrorToReason(errors) })})
    )
    (result => ({statusCode: 200, body: JSON.stringify({ verified: true, bearer: result })}));

export {
    checkStatus
};