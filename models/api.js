var parseObjectId = require('mongodb').ObjectId;
var { createConnection } = require('./database')
var _ = require('lodash');
var moment = require('moment');

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

        createConnection((q) => {
            q.collection(params.table).find(params.filter ? params.filter : {}).toArray((err, lists) => {
                if (err) {
                    reject({ status: 412, message: err.message })
                } else {
                    if (params.fields) {
                        if (Array.isArray(params.fields)) {
                            if (params.fields.length) {
                                lists = _.compact(lists.map((q) => {
                                    let obj = {
                                        id: q._id,
                                        dateCreated: new Date(),
                                        dateUpdated: new Date()
                                    };
                                    params.fields.map((field) => {
                                        if (q.hasOwnProperty(field)) {
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
        })
    });
};

exports.Post = (params) => {
    return new Promise((resolve, reject) => {
        createConnection(q => {
            var a = q.collection(params.table);
            q.collection(params.table).insertOne(params.formData, function (err, lists) {
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