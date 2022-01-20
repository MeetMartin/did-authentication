import { isNothing, Either, AsyncEffect, reduce, isEqual } from '@7urtle/lambda';
import faunadb from 'faunadb';

import { getValueFromEnv } from './Environment';

const getFaunaSecretFromEnv = () => getValueFromEnv('FAUNA_SECRET');

const getClient = secret =>
    Either
    .try(() => new faunadb.Client({ secret: secret }));

const createCollection = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('createCollection request.client is Nothing.')) ||
        (isNothing(request.params) && reject('createCollection request.params is Nothing.')) ||
        request.client.query(
            faunadb.query.CreateCollection(request.params)
        ).then(resolve).catch(error => reject(`Creating Fauna Collection: ${error}`))
    );

const createCollectionIfItDoesntExist = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('createCollectionIfItDoesntExist request.client is Nothing.')) ||
        (isNothing(request.params) && reject('createCollectionIfItDoesntExist request.params is Nothing.')) ||
        request.client.query(
            faunadb.query.CreateCollection(request.params)
        )
        .then(resolve)
        .catch(error =>
            isEqual('BadRequest: instance already exists')(error + '')
            ? request.client.query(
                faunadb.query.Collection(request.params.name)
              ).then(resolve).catch(error => reject(`Finding existing Fauna Collection while creating new Fauna Collection: ${error}`))
            : reject(`Creating Fauna Collection: ${error}`)
        )
    );

const createIndex = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('createIndex request.client is Nothing.')) ||
        (isNothing(request.name) && reject('createIndex request.name is Nothing.')) ||
        (isNothing(request.source) && reject('createIndex request.source is Nothing.')) ||
        (isNothing(request.params) && reject('createIndex request.params is Nothing.')) ||
        request.client.query(
            faunadb.query.CreateIndex({
                name: request.name,
                source: faunadb.query.Collection(request.source),
                ...request.params
            })
        ).then(resolve).catch(error => reject(`Creating Fauna Index: ${error}`))
    );

const createIndexIfItDoesntExist = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('createIndexIfItDoesntExist request.client is Nothing.')) ||
        (isNothing(request.name) && reject('createIndexIfItDoesntExist request.name is Nothing.')) ||
        (isNothing(request.source) && reject('createIndexIfItDoesntExist request.source is Nothing.')) ||
        (isNothing(request.params) && reject('createIndexIfItDoesntExist request.params is Nothing.')) ||
        request.client.query(
            faunadb.query.CreateIndex({
                name: request.name,
                source: faunadb.query.Collection(request.source),
                ...request.params
            })
        )
        .then(resolve)
        .catch(error =>
            isEqual('BadRequest: instance already exists')(error + '')
            ? request.client.query(
                faunadb.query.Index(request.name)
              ).then(resolve).catch(error => reject(`Finding existing Fauna Index while creating new Fauna Index: ${error}`))
            : reject(`Creating Fauna Index: ${error}`)
        )
    );

const createDocument = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('createDocument request.client is Nothing.')) ||
        (isNothing(request.collection) && reject('createDocument request.collection is Nothing.')) ||
        (isNothing(request.data) && reject('createDocument request.data is Nothing.')) ||
        request.client.query(
            faunadb.query.Create(
                faunadb.query.Collection(request.collection),
                { data: request.data }
            )
        ).then(resolve).catch(error => reject(`Creating Fauna Document: ${error}`))
    );

const listCollections = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('listCollections request.client is Nothing.')) ||
        request.client.query(
            faunadb.query.Paginate(
                faunadb.query.Collections()
            )
        )
        .then(response => resolve(reduce([])((a, c) => [...a, c.value.id])(response.data)))
        .catch(error => reject(`Listing Fauna Collections: ${error}`))
    );

const getDocumentByIndex = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('getDocumentByIndex request.client is Nothing.')) ||
        (isNothing(request.index) && reject('getDocumentByIndex request.index is Nothing.')) ||
        (isNothing(request.data) && reject('getDocumentByIndex request.data is Nothing.')) ||
        request.client.query(
            faunadb.query.Get(
                faunadb.query.Match(
                    faunadb.query.Index(request.index),
                    request.data
                )
            )
        ).then(resolve).catch(error => reject(`Getting Fauna Document By Index: ${error}`))
    );

const deleteDocumentByIndex = request =>
    AsyncEffect
    .of(reject => resolve =>
        (isNothing(request.client) && reject('getDocumentByIndex request.client is Nothing.')) ||
        (isNothing(request.index) && reject('getDocumentByIndex request.index is Nothing.')) ||
        (isNothing(request.data) && reject('getDocumentByIndex request.data is Nothing.')) ||
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
        ).then(resolve).catch(error => reject(`Deleting Fauna Document By Index: ${error}`))
    );

export {
    getFaunaSecretFromEnv,
    getClient,
    createCollection,
    createCollectionIfItDoesntExist,
    createIndex,
    createIndexIfItDoesntExist,
    createDocument,
    listCollections,
    getDocumentByIndex,
    deleteDocumentByIndex
};