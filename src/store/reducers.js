import logger from '../logger';
import types from "./types";

const stateFromLocalStorage = sessionStorage.getItem('state');

const initialState = stateFromLocalStorage
    ? {...JSON.parse(stateFromLocalStorage), ngrokURL: null}
    : {
        ngrokURL: null,
        userName: '',
        signUpError: '',
        bearer: '',
        requestedSignUp: false,
        requestedSignIn: false,
        authenticated: false,
        authenticating: false,
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
        case(types.REQUEST_SIGN_IN):
            return ({
                ...state,
                requestedSignIn: true
            });
        case(types.RECEIVE_SIGN_UP_ERROR):
            return ({
                ...state,
                signUpError: action.payload,
                authenticating: false,
                userName: ''
            });
        case(types.RECEIVE_WALLET_VERIFICATION):
            return ({
                ...state,
                bearer: action.payload,
                authenticating: false
            });
        case(types.CREATE_USER):
            return ({
                ...state,
                requestedSignUp: false
            });
        case(types.READ_USER):
            return ({
                ...state,
                requestedSignIn: false
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
        case(types.REQUEST_SIGN_IN_BY_NAME):
            return ({
                ...state,
                authenticating: true
            });
        default:
            return state;
    }
};

export { initialState, reducer };