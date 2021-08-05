import { AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';

const createJWS = payload =>
    AsyncEffect
    .ofPromise(() =>
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
        )
    );

export {
    createJWS
};