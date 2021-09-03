import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';

const createJWS = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload.tenant) && reject('createJWS payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createJWS payload.accessToken is Nothing.')) ||
        (isNothing(payload.didUrl) && reject('createJWS payload.didUrl is Nothing.')) ||
        (isNothing(payload.request) && reject('createJWS payload.request is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/messaging/sign`,
            {
                "didUrl": payload.didUrl,
                "payload": payload.request
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        ).then(resolve).catch(error => reject(`Creating JWS: ${error}.${error?.response?.data?.message && ` ${error.response.data.message}.`}`))
    );

const createJWE = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload.tenant) && reject('createJWE payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createJWE payload.accessToken is Nothing.')) ||
        (isNothing(payload.didUrl) && reject('createJWE payload.didUrl is Nothing.')) ||
        (isNothing(payload.recipientDids) && reject('createJWE payload.recipientDids is Nothing.')) ||
        (isNothing(payload.request) && reject('createJWE payload.request is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/messaging/encrypt`,
            {
                "senderDidUrl": payload.didUrl,
                "recipientDidUrls": payload.recipientDids,
                "payload": payload.request
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        ).then(resolve).catch(error => reject(`Creating JWE: ${error}.${error?.response?.data?.message && ` ${error.response.data.message}.`}`))
    );

export {
    createJWS,
    createJWE
};