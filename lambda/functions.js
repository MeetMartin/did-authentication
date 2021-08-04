import ngrok from 'ngrok';
import Server from '@7urtle/server';
import { AsyncEffect, compose, map, passThrough } from '@7urtle/lambda';
import fs from 'fs';

import logger from '../src/logger';
import { handler as DIDHandler } from './did/did';

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
 const requestToNetlifyHandlerEvent = request =>
 ({
     ...request,
     body: JSON.stringify(request.data)
 });

/**
 * Wraps Netlify handler into AsyncEffect.
 * 
 * @HindleyMilner handlerToAsyncEffect :: (a -> b) -> object -> AsyncEffect.of(() -> (object -> b))
 *
 * @pure
 * @param {function} handler Netlify function handler
 * @param {object} request Netlify event object
 * @returns {AsyncEffect} AsyncEffect of Netlify function handler
 * 
 * @example
 * handlerToAsyncEffect(async (event, context) => ({}))({path: '/path'}); // => AsyncEffect
 */
const handlerToAsyncEffect = handler => event => AsyncEffect.ofPromise(() => handler(event));

/**
 * Returns AsyncEffect for ngrok tunnel to the provided port on localhost.
 * 
 * @HindleyMilner useNgrok :: number -> AsyncEffect
 *
 * @pure
 * @param {number} port localhost port for ngrok
 * @returns {AsyncEffect} AsyncEffect for ngrok tunnel to the provided port on localhost
 * 
 * @example
 * useNgrok(5000); // => AsyncEffect
 */
const useNgrok = port => AsyncEffect.ofPromise(() => ngrok.connect(port));

/**
 * Returns AsyncEffect for ngrok tunnel to the provided port on localhost.
 * Sets up environment viriable ngrok to point to the url setup by ngrok on success.
 * 
 * @HindleyMilner setupWithNgrok :: number -> AsyncEffect
 *
 * @pure
 * @param {number} port localhost port for ngrok
 * @returns {AsyncEffect} AsyncEffect for ngrok tunnel to the provided port on localhost
 * 
 * @example
 * setupWithNgrok(5000); // => AsyncEffect
 */
const setupWithNgrok = compose(
    map(passThrough(url => process.env.ngrok = url)),
    useNgrok
);

/**
 * Adds cors headers to support local development against localhost:8080
 * 
 * @HindleyMilner addCORSForLocalDevelopment :: object -> object
 *
 * @pure
 * @returns {object} response object
 * 
 * @example
 * addCORSForLocalDevelopment({});
 * // => {
 *  'Access-Control-Allow-Origin': 'http://localhost:8080',
 *  'Access-Control-Request-Method': 'POST, OPTIONS, GET, HEAD',
 *  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
 * }
 */
 const addCORSForLocalDevelopment = response => ({
    ...response,
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Request-Method': 'POST, OPTIONS, GET, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

/**
 * Makes sure that response data appear in the response content
 * 
 * @HindleyMilner getResponseData :: object -> object
 *
 * @pure
 * @returns {object} response objecct
 * @example
 * getResponseData({body: 'hello world'}); // => {body: 'hello world', content: 'hello world'}
 */
const getResponseData = response => ({
    ...response,
    content: response.body
});

/**
 * Add no-store Cache Control header
 * 
 * @HindleyMilner noCacheHeader :: object -> object
 *
 * @pure
 * @returns {object} response object
 * 
 * @example
 * noCacheHeader({anything: 'anything'}); // => {anything: 'anything', 'Cache-Control': 'no-store'}
 */
 const noCacheHeader = response => ({
    ...response,
    'Cache-Control': 'no-store'
});

/**
 * Sets response status based on Netlify function statusCode
 * 
 * @HindleyMilner setStatus :: object -> object
 *
 * @pure
 * @returns {object} response with status
 * 
 * @example
 * setStatus({statusCode: 200}); // => {statusCode: 200, status: 200}
 */
const setStatus = response => ({
    ...response,
    status: response.statusCode
})

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
    map(getResponseData),
    map(noCacheHeader),
    map(addCORSForLocalDevelopment),
    map(setStatus),
    handlerToAsyncEffect(handler),
    requestToNetlifyHandlerEvent
);

const rootPath = request =>
    AsyncEffect.of(_ => resolve => resolve(addCORSForLocalDevelopment({
        ...request,
        status: 200,
        contentType: 'text/plain',
        content: 'This is root. I am working but nothing to see here.'
    })));

const optionsAPI = request =>
    AsyncEffect.of(_ => resolve => resolve({
        ...request,
        status: 204,
        allow: 'OPTIONS, POST',
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }));

const ngrokPath = request =>
    AsyncEffect.of(reject => resolve =>
        process.env.ngrok
        ? resolve(addCORSForLocalDevelopment({
            ...request,
            status: 200,
            contentType: 'text/plain',
            content: process.env.ngrok
        }))
        : reject(addCORSForLocalDevelopment({
            ...request,
            status: 500,
            contentType: 'text/plain',
            content: 'ngrok not available'
        }))
    );

const port = 5000;

const configuration = {
    options: {
        port: port
    },
    logger: logger,
    routes: [
        {
            path: '/',
            api: {
                options: optionsAPI,
                any: rootPath
            }
        },
        {
            path: '/ngrok',
            api: {
                options: optionsAPI,
                any: ngrokPath
            }
        },
        {
            path: '/did/*',
            api: {
                options: optionsAPI,
                any: netlifyFunctionHandler(DIDHandler)
            }
        }
    ],
};

// starts local server
Server.start(configuration);

// starts ngrok tunnel to the local server (backend only)
setupWithNgrok(port)
    .trigger
    (error => logger.error(`Issue in setup up of Ngrok: ${error}`))
    (url => logger.info(`Ngrok available on ${url}.`));