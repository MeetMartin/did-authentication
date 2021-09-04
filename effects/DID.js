import { isNothing, AsyncEffect } from '@7urtle/lambda';
import axios from 'axios';

const createDID = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload.tenant) && reject('createDID payload.tenant is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('createDID payload.accessToken is Nothing.')) ||
        axios.post(
            `https://${payload.tenant}/v1/dids`,
            {
                "method": payload.method || "key"
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        ).then(resolve).catch(error => reject(`Creating DID: ${error}`))
    );

const readDID = payload =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(payload.tenant) && reject('readDID payload.tenant is Nothing.')) ||
        (isNothing(payload.did) && reject('readDID payload.did is Nothing.')) ||
        (isNothing(payload.accessToken) && reject('readDID payload.accessToken is Nothing.')) ||
        axios.get(
            `https://${payload.tenant}/v1/dids/${payload.did}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${payload.accessToken}`
                }
            }
        ).then(resolve).catch(error => reject(`Reading DID: ${error}`))
    );

export {
    createDID,
    readDID
};