import { isNothing, Either, AsyncEffect } from '@7urtle/lambda';
import faunadb from 'faunadb';

import { getValueFromEnv } from './Environment';

const getFaunaSecretFromEnv = () => getValueFromEnv('FAUNA_SECRET');

const getClient = secret =>
    Either
    .try(() => new faunadb.Client({ secret: secret }));

const createRecord = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('createRecord request.client is Nothing.')) ||
        (isNothing(request.collection) && reject('createRecord request.collection is Nothing.')) ||
        (isNothing(request.data) && reject('createRecord request.data is Nothing.')) ||
        request.client.query(
            faunadb.query.Create(
                faunadb.query.Collection(request.collection),
                {data: request.data}
            )
        ).then(resolve).catch(error => reject(`Creating Fauna Record: ${error}`))
    );

const getRecordByIndex = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('getRecordByIndex request.client is Nothing.')) ||
        (isNothing(request.index) && reject('getRecordByIndex request.index is Nothing.')) ||
        (isNothing(request.data) && reject('getRecordByIndex request.data is Nothing.')) ||
        request.client.query(
            faunadb.query.Get(
                faunadb.query.Match(
                    faunadb.query.Index(request.index),
                    request.data
                )
            )
        ).then(resolve).catch(error => reject(`Getting Fauna Record By Index: ${error}`))
    );

const deleteRecordByIndex = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('getRecordByIndex request.client is Nothing.')) ||
        (isNothing(request.index) && reject('getRecordByIndex request.index is Nothing.')) ||
        (isNothing(request.data) && reject('getRecordByIndex request.data is Nothing.')) ||
        request.client.query(
            faunadb.query.Delete(
                faunadb.query.Select(
                    'ref',
                    faunadb.query.Get(
                        faunadb.query.Match(
                            faunadb.query.Index(request.index),
                            request.data
                        )
                    )
                )
            )
        ).then(resolve).catch(error => reject(`Deleting Fauna Record By Index: ${error}`))
    );

export {
    getFaunaSecretFromEnv,
    getClient,
    createRecord,
    getRecordByIndex,
    deleteRecordByIndex
};