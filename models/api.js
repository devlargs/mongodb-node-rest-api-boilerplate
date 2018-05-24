var parseObjectId = require('mongodb').ObjectId;
var { createConnection, getCollections } = require('./database')
var _ = require('lodash');
var moment = require('moment');

let collections;
getCollections((e) => { collections = e; });

exports.Get = (params) => {
    return new Promise((resolve, reject) => {
        if (params.id) {
            try {
                params.filter = {
                    _id: parseObjectId(params.id)
                }
            } catch (ex) {
                resolve({
                    length: 0,
                    lists: [],
                    status: 200,
                    message: 'No results found'
                });
            }
        }

        createConnection((db) => {
            if (collections.includes(params.table)) {
                db.collection(params.table).find(params.filter ? params.filter : {}).toArray((err, lists) => {
                    if (err) {
                        reject({ status: 412, message: err.message })
                    } else {
                        if (params.fields) {
                            if (Array.isArray(params.fields)) {
                                if (params.fields.length) {
                                    lists = _.compact(lists.map((list) => {
                                        let obj = {
                                            id: list._id,
                                            dateCreated: new Date(),
                                            dateUpdated: new Date()
                                        };
                                        params.fields.map((field) => {
                                            if (list.hasOwnProperty(field)) {
                                                obj[field] = q[field]
                                            }
                                        });
                                        return obj;
                                    }));
                                }
                            }
                        }
                        resolve({
                            length: lists.length,
                            lists,
                            status: 200,
                            message: 'Data fetched.'
                        })
                    }
                });
            } else {
                resolve({
                    message: 'Table not found.',
                    status: 403
                })
            }
        })
    });
};

exports.Post = (params) => {
    return new Promise((resolve, reject) => {
        createConnection(db => {
            db.collection(params.table).insertOne(params.formData, function (err, lists) {
                if (err) {
                    reject({ status: 403, err })
                } else {
                    resolve({
                        inserted: lists.ops,
                        length: lists.ops.length,
                        status: 200,
                        message: 'Successfully added'
                    })
                }
            })
        })
    })
}