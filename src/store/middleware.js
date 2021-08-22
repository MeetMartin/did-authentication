import types from './types';
import logger from '../logger';
import { getNgrokUrl } from './hooks/NgrokHook';
import { getDIDStatusByChallengeId } from './hooks/DIDStatusHook';

const applyMiddleware = state => dispatch => action => {
    switch (action.type) {
        case types.REQUEST_NGROK_URL:
            logger.debug('[applyMiddleware]', types.REQUEST_NGROK_URL);
            getNgrokUrl(dispatch)(action);
            break;
        case types.REQUEST_WALLET_VERIFICATION:
            logger.debug('[applyMiddleware]', types.REQUEST_WALLET_VERIFICATION);
            getDIDStatusByChallengeId(dispatch)(action);
            break;
    };
    dispatch(action);
};

export { applyMiddleware };