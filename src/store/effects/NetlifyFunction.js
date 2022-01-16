import { AsyncEffect, isEqual, Maybe, map, replace } from '@7urtle/lambda';
import axios from 'axios';

const api_url =
    isEqual('development')(process.env.NODE_ENV)
    ? replace('5000')('8080')(window.location.origin)
    : '/.netlify/functions';
    
const getToFunction = path => headers =>
    map(response => Maybe.of(response.data))
    (
        AsyncEffect.ofPromise(() =>
            axios.get(
                api_url + path,
                headers
            )
        )
    );

const deleteToFunction = path => headers =>
    (
        AsyncEffect.ofPromise(() =>
            axios.delete(
                api_url + path,
                headers
            )
        )
    );

const postToFunction = path => payload => headers =>
    map(response => Maybe.of(response.data))
    (
        AsyncEffect.ofPromise(() =>
            axios.post(
                api_url + path,
                payload,
                headers
            )
        )
    );

export {
    getToFunction,
    postToFunction,
    deleteToFunction
}