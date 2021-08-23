import { maybe } from '@7urtle/lambda';
import { postToUser } from '../effects/UserEffect';
import types from '../types';

export const createUser = dispatch => action =>
    postToUser(action.payload.bearer)({userName: action.payload.userName}).trigger
    (error => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Internal error.'}))
    (maybe
        (() => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Unknown data error.'}))
        (payload => dispatch({type: types.RECEIVE_AUTHENTICATION, payload: payload}))
    );