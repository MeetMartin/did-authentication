import { AsyncEffect, isEqual, Maybe, map } from '@7urtle/lambda';
import axios from 'axios';

const api_url = isEqual('development')(process.env.NODE_ENV) ? 'http://localhost:5000' : '/.netlify/functions';

/**
 * Ansynchronous post request to a Netlify Function on an input path
 * that maybe returns a returns response data based on input data.
 * 
 * @HindleyMilner postToFunction :: string -> object -> AsyncEffect.of(Maybe.of(object))
 *
 * @pure
 * @param {string} path path to the Netlify Function added to /.netlify/functions
 * @param {object} data data to be posted to the function
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
export const postToFunction = path => data =>
    map(response => Maybe.of(response.data))
    (
        AsyncEffect.ofPromise(() =>
            axios.post(
                api_url + path,
                data
            )
        )
    );