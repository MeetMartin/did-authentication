import { getToFunction } from './NetlifyFunction';

export const getStatus = challengeId => getToFunction(`/did/status/${challengeId}`);