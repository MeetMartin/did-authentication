import { AsyncEffect, isEqual, Maybe, map } from '@7urtle/lambda';
import axios from 'axios';

const api_url = isEqual('development')(process.env.NODE_ENV) ? 'http://localhost:5000' : '/.netlify/functions';

/**
 * Ansynchronous get request to a Netlify Function on an input path
 * that maybe returns a returns response data.
 * 
 * @HindleyMilner getToFunction :: string -> () -> AsyncEffect(Maybe))
 *
 * @pure
 * @param {string} path path to the Netlify Function added to /.netlify/functions
 * @returns {AsyncEffect} AsyncEffect of Maybe of quote object
 * 
 * @example
 * getToFunction('/my-function')()
 * .trigger
 * (error => console.log(error))
 * (MaybeData =>
 *  maybe
 *  (() => console.log('Response data is Nothing.'))
 *  (data => console.log('Response data are: ', data))
 *  (MaybeData)
 * );
 */
const getToFunction = path => () =>
    map(response => Maybe.of(response.data))
    (
        AsyncEffect.ofPromise(() =>
            axios.get(
                api_url + path
            )
        )
    );

/**
 * Ansynchronous post request to a Netlify Function on an input path
 * that maybe returns a returns response data based on input payload.
 * 
 * @HindleyMilner postToFunction :: string -> object -> AsyncEffect(Maybe)
 *
 * @pure
 * @param {string} path path to the Netlify Function added to /.netlify/functions
 * @param {object} payload payload to be posted to the function
 * @returns {AsyncEffect} AsyncEffect of Maybe of quote object
 * 
 * @example
 * postToFunction('/my-function')({something: 'something'})
 * .trigger
 * (error => console.log(error))
 * (MaybeData =>
 *  maybe
 *  (() => console.log('Response data is Nothing.'))
 *  (data => console.log('Response data are: ', data))
 *  (MaybeData)
 * );
 */
const postToFunction = path => payload =>
map(response => Maybe.of(response.data))
(
    AsyncEffect.ofPromise(() =>
        axios.post(
            api_url + path,
            payload
        )
    )
);

export {
    getToFunction,
    postToFunction
}