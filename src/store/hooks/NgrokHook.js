import { maybe } from '@7urtle/lambda';

import types from "../types";
import logger from '../../logger';
import { requestNgrokUrl } from '../effects/NgrokEffect';

export const getNgrokUrl = dispatch => action =>
    requestNgrokUrl(action) // returns AsyncEffect
        .trigger
        (logger.error) // error in AsyncEffect
        (maybe // success in AsyncEffect
            (() => logger.error('Requesting ngrok url returned invalid data,')) // Maybe result is Nothing
            (value => dispatch({type: types.RECEIVE_NGROK_URL, payload: value})) // Maybe result is Just
        );