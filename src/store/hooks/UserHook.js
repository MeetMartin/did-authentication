import { maybe } from '@7urtle/lambda';
import { postToUser, getToUser, deleteToUser } from '../effects/UserEffect';
import types from '../types';

export const createUser = dispatch => action =>
    postToUser(action.payload.bearer)({userName: action.payload.userName})
    .trigger
    (error => error?.response?.data?.reason
        ? dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: error.response.data.reason})
        : dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Internal error.'})
    )
    (maybe
        (() => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Unknown data error.'}))
        (payload => dispatch({type: types.RECEIVE_AUTHENTICATION, payload: payload}))
    );

export const readUser = dispatch => action =>
    getToUser(action.payload.bearer)
    .trigger
    (error => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Internal error.'}))
    (maybe
        (() => dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: 'Unknown data error.'}))
        (payload => 
            payload.reason
            ? dispatch({type: types.RECEIVE_SIGN_UP_ERROR, payload: payload.reason})
            : dispatch({type: types.RECEIVE_AUTHENTICATION, payload: payload})
        )
    );

export const deleteUser = dispatch => action =>
    deleteToUser(action.payload.bearer)
    .trigger
    (error => console.log('error deleting user'))
    (() => dispatch({type: types.REQUEST_SIGN_OUT}));