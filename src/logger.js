import logger from '@7urtle/logger';
import {upperCaseOf} from '@7urtle/lambda';

const configuration = {
    levels: {
        log: true,
        debug: true,
        info: true,
        warn: true,
        error: true
    },
    decorator: level => input => `${upperCaseOf(level)}: ${input}`
};

export default logger(configuration);