import { isNothing, Either, AsyncEffect } from '@7urtle/lambda';
import faunadb from 'faunadb';

const getFaunaSecretFromEnv = () =>
    isNothing(process.env.FAUNA_SECRET)
    ? Either.Failure('process.env.FAUNA_SECRET is Nothing.')
    : Either.Success(process.env.FAUNA_SECRET);

const getClient = secret =>
    Either
    .try(() => new faunadb.Client({ secret: secret }));

const createRecord = request =>
    AsyncEffect
    .ofPromise(() =>
        request.client.query(
            faunadb.query.Create(
                faunadb.query.Collection(request.collection),
                {data: request.data}
            )
        )
    );

const getRecordByIndex = request =>
    AsyncEffect
    .ofPromise(() =>
        request.client.query(
            faunadb.query.Get(
                faunadb.query.Match(
                    faunadb.query.Index(request.index),
                    request.data
                )
            )
        )
    );

const deleteRecordByIndex = request =>
    AsyncEffect
    .ofPromise(() =>
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
        )
    );

export {
    getFaunaSecretFromEnv,
    getClient,
    createRecord,
    getRecordByIndex,
    deleteRecordByIndex
};