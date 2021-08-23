import { getToFunction, postToFunction } from './NetlifyFunction';

export const postToUser = bearer => payload => postToFunction(`/user`)(payload)({ headers: { 'Authorization': `Bearer ${bearer}` }});

export const getToUser = bearer => getToFunction(`/user`)({ headers: { 'Authorization': `Bearer ${bearer}` }});