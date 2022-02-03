import { getToFunction, postToFunction } from './NetlifyFunction';

export const getStatus = requestId => getToFunction(`/did/status/${requestId}`)();
export const getSignInByName = payload => postToFunction(`/did/push-authentication/`)(payload)();