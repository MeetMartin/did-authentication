import logger from '../logger';
import types from "./types";

const initialState = {
    ngrokURL: null,
    userName: ''
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
            })
        default:
            return state;
    }
};

export { initialState, reducer };