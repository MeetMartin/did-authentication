import types from './types';
import logger from '../logger';
import { getNgrokUrl } from './hooks/NgrokHook';

const applyMiddleware = state => dispatch => action => {
    switch (action.type) {
        case types.REQUEST_NGROK_URL:
            logger.debug('[applyMiddleware]', types.REQUEST_NGROK_URL);
            getNgrokUrl(dispatch)(action);
            break;
    };
    dispatch(action);
};

export { applyMiddleware };