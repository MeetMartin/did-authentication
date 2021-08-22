import { isJust, isEqual, maybe } from '@7urtle/lambda';
import { getStatus } from '../effects/DIDStatus';
import types from '../types';

export const getDIDStatusByChallengeId = dispatch => action =>
    getStatus(action.payload).trigger
    (error => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Internal error.'}))
    (maybe
        (() => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Unknown data error.'}))
        (data =>
            isEqual(true)(data.verified)
            ? dispatch({type: types.RECEIVE_WALLET_VERIFICATION})
            : isJust(data.reason)
                ? dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: data.reason})
                : dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Unknown error.'})
        )
    );