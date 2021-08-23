import logger from '../logger';
import types from "./types";

const initialState = {
    ngrokURL: null,
    userName: '',
    signUpError: '',
    bearer: '',
    requestedSignUp: false,
    requestedSignIn: false,
    authenticated: false
};

const reducer = (state = initialState, action) => {

    logger.debug('[reducer]', action.type);

    switch (action.type) {
        case(types.RECEIVE_NGROK_URL):
            return ({
                ...state,
                ngrokURL: action.payload
            });
        case(types.RECEIVE_USER_NAME):
            return ({
                ...state,
                userName: action.payload
            });
        case(types.REQUEST_SIGN_UP):
            return ({
                ...state,
                requestedSignUp: true
            });
        case(types.RECEIVE_SIGN_UP_ERROR):
            return ({
                ...state,
                signUpError: action.payload
            });
        case(types.RECEIVE_WALLET_VERIFICATION):
            return ({
                ...state,
                bearer: action.payload
            });
        case(types.CREATE_USER):
            return ({
                ...state,
                requestedSignUp: false
            });
        case(types.RECEIVE_AUTHENTICATION):
            return ({
                ...state,
                authenticated: true,
                userName: action.payload.userName
            });
        case(types.REQUEST_SIGN_OUT):
            return ({
                ...state,
                authenticated: false,
                userName: '',
                bearer: ''
            });
        default:
            return state;
    }
};

export { initialState, reducer };