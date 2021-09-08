import { isJust, isEqual, maybe, identity } from '@7urtle/lambda';

import logger from '../../logger';
import { getStatus, getSignInByName } from '../effects/DIDEffect';
import types from '../types';

export const getDIDStatusByChallengeId = dispatch => action =>
    getStatus(action.payload).trigger
    (() => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Verification Check: Internal error.'}))
    (maybe
        (() => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Verification Check: Unknown data error.'}))
        (data =>
            isEqual(true)(data.verified)
            ? dispatch({type: types.RECEIVE_WALLET_VERIFICATION, payload: data.bearer})
            : isJust(data.reason)
                ? logger.debug(`DID Status Check: ${data.reason}`)
                : dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Verification Check: Unknown error.'})
        )
    );

export const getDIDSignInByName = dispatch => action =>
    getSignInByName(action.payload).trigger
    (error => error?.response?.data?.reason
        ? dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: error.response.data.reason})
        : dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Internal error.'}))
    (identity);