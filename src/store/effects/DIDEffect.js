import { getToFunction, postToFunction } from './NetlifyFunction';

export const getStatus = challengeId => getToFunction(`/did/status/${challengeId}`)();
export const getSignInByName = payload => postToFunction(`/did/push-authentication/`)(payload)();