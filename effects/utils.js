// @ts-check

import { deepInspect } from '@7urtle/lambda';

/**
* @typedef {object} MATTRError
* @property {{data: {message: string, details: string}}} response
*/

/**
 * formatError tkaes MATTRError returned by the MATTR platform and formats it
 * into an error string.
 * 
 * @pure
 * @HindleyMilner formatError :: MATTRError -> string
 * @param {MATTRError} error 
 * @returns {string}
 */
const formatError = error =>
    `${error}.` +
    `${error && error.response && error.response.data && error.response.data.message ? ` ${error.response.data.message}.` : ''}` +
    `${error && error.response && error.response.data && error.response.data.details ? ` ${deepInspect(error.response.data.details)}.` : ''}`;

export {
    formatError
};