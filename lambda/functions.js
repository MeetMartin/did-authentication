import Server from '@7urtle/server';
import createLogger from '@7urtle/logger';
import { AsyncEffect, compose, map } from '@7urtle/lambda';

import { handler as QuoteHandler } from './quote/quote';

/**
 * Turns node HTTP request into event object expected by Netlify function handler
 * 
 * @HindleyMilner requestToNetlifyHandlerEvent :: object -> object
 *
 * @pure
 * @param {object} request Node HTTP request object
 * @returns {object} Netlify function handler event
 * 
 * @example
 * requestToNetlifyHandlerEvent(request); // => event
 */
const requestToNetlifyHandlerEvent = request => (headers => ({path: request.path, body: JSON.stringify(headers.data)}))((({configuration, ...headers}) => headers)(request));

/**
 * Adds cors headers to support local development against localhost:8080
 * 
 * @HindleyMilner addCORSForLocalDevelopment :: functor -> functor
 *
 * @pure
 * @returns {functor} inputed functor with mapped over cors headers
 * 
 * @example
 * addCORSForLocalDevelopment(functor); // => functor
 */
const addCORSForLocalDevelopment = map(response => ({
    ...response,
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Request-Method': 'POST, OPTIONS, GET, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}));

/**
 * Makes sure that response data appear in the response content
 * 
 * @HindleyMilner getResponseData :: functor -> functor
 *
 * @pure
 * @returns {functor} inputed functor with mapped over content data
 * 
 * @example
 * getResponseData(functor); // => functor
 */
const getResponseData = map(response => ({
    ...response,
    content: response.body
}));

/**
 * Add no-store Cache Control header
 * 
 * @HindleyMilner noCacheHeader :: functor -> functor
 *
 * @pure
 * @returns {functor} inputed functor with mapped over content data
 * 
 * @example
 * noCacheHeader(functor); // => functor
 */
 const noCacheHeader = map(response => ({
    ...response,
    'Cache-Control': 'no-store'
}));

/**
 * Sets response status based on Netlify function statusCode
 * 
 * @HindleyMilner setStatus :: functor -> functor
 *
 * @pure
 * @returns {functor} inputed functor with mapped over content data
 * 
 * @example
 * setStatus(functor); // => functor
 */
const setStatus = map(response => ({
    ...response,
    status: response.statusCode
}))

/**
 * Accepts Netlify function handler and returns AsyncEffect accepted by @lambda/server route response
 * 
 * @HindleyMilner netlifyFunctionHandler :: ((object, object) -> object) -> object -> AsyncEffect
 *
 * @pure
 * @param {function} handler Netlify function handler
 * @returns {AsyncEffect} AsyncEffect accepted by @lambda/server route response
 * 
 * @example
 * netlifyFunctionHandler(handler)(request); // => AsyncEffect
 */
const netlifyFunctionHandler = handler => compose(
    getResponseData,
    noCacheHeader,
    addCORSForLocalDevelopment,
    setStatus,
    AsyncEffect.ofPromise,
    handler,
    requestToNetlifyHandlerEvent
);

const rootPath = {
    any: request =>
        AsyncEffect.of((_, resolve) => resolve({
            ...request,
            status: 200,
            contentType: 'text/plain',
            content: 'This is root. I am working but nothing to see here.'
        }))
}

const optionsAPI = request =>
    AsyncEffect.of((_, resolve) => resolve({
        ...request,
        status: 204,
        allow: 'OPTIONS, POST',
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }));

const configuration = {
    options: {
        port: 5000
    },
    logger: createLogger(),
    routes: [
        {
            path: '/',
            api: rootPath
        },
        {
            path: '/quote/*',
            api: {
                options: optionsAPI,
                any: netlifyFunctionHandler(QuoteHandler)
            }
        }
    ],
};

Server.start(configuration);