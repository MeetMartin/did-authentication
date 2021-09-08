import types from './types';
import logger from '../logger';
import { getNgrokUrl } from './hooks/NgrokHook';
import { getDIDStatusByChallengeId, getDIDSignInByName } from './hooks/DIDHook';
import { createUser, readUser, deleteUser } from './hooks/UserHook';

const applyMiddleware = state => dispatch => action => {
    switch (action.type) {
        case types.REQUEST_NGROK_URL:
            logger.debug('[applyMiddleware]', types.REQUEST_NGROK_URL);
            getNgrokUrl(dispatch)(action);
            break;
        case types.REQUEST_SIGN_UP:
            logger.debug('[applyMiddleware]', types.REQUEST_SIGN_UP);
            getDIDStatusByChallengeId(dispatch)(action);
            break;
        case types.CREATE_USER:
            logger.debug('[applyMiddleware]', types.CREATE_USER);
            createUser(dispatch)({payload: {userName: state.userName, bearer: state.bearer}});
            break;
        case types.REQUEST_SIGN_IN:
            logger.debug('[applyMiddleware]', types.REQUEST_SIGN_IN);
            getDIDStatusByChallengeId(dispatch)(action);
            break;
        case types.REQUEST_SIGN_IN_BY_NAME:
            logger.debug('[applyMiddleware]', types.REQUEST_SIGN_IN_BY_NAME);
            getDIDSignInByName(dispatch)(action);
            break;
        case types.READ_USER:
            logger.debug('[applyMiddleware]', types.READ_USER);
            readUser(dispatch)({payload: {bearer: state.bearer}});
            break;
        case types.DELETE_USER:
            logger.debug('[applyMiddleware]', types.DELETE_USER);
            deleteUser(dispatch)({payload: {bearer: state.bearer}});
            break;
    };
    dispatch(action);
};

export { applyMiddleware };