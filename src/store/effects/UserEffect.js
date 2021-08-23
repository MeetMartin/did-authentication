import { getToFunction, postToFunction, deleteToFunction } from './NetlifyFunction';

export const postToUser = bearer => payload => postToFunction(`/user`)(payload)({ headers: { 'Authorization': `Bearer ${bearer}` }});

export const getToUser = bearer => getToFunction(`/user`)({ headers: { 'Authorization': `Bearer ${bearer}` }});

export const deleteToUser = bearer => deleteToFunction(`/user`)({ headers: { 'Authorization': `Bearer ${bearer}` }});