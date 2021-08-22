import logger from '../logger';
import types from "./types";

const initialState = {
    ngrokURL: null,
    userName: '',
    signUpError: ''
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
        case(types.REQUEST_WALLET_VERIFICATION):
            return ({
                ...state,
                challengeId: action.payload
            });
        case(types.RECEIVE_SIGN_UP_ERROR):
            return ({
                ...state,
                signUpError: action.payload
            });
        default:
            return state;
    }
};

export { initialState, reducer };