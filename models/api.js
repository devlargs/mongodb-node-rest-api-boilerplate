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
                    status: 200,
                    message: 'No results found'
                });
            }
        }

        createConnection((db) => {
            db.collection(params.table).find(params.filter ? params.filter : {}).toArray((err, lists) => {
                if (err) {
                    reject({ status: 412, message: `Get | ${err.message}` })
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
        })
    });
};

exports.Post = (params) => {
    return new Promise((resolve, reject) => {
        createConnection(db => {
            db.collection(params.table).insertOne(params.formData, (err, lists) => {
                if (err) {
                    reject({ status: 412, message: `Post | ${err.message}` })
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

exports.Put = (params) => {
    return new Promise((resolve, reject) => {
        if (params.id) {
            try {
                params.filter = {
                    _id: parseObjectId(params.id)
                }
            } catch (ex) {
                resolve({
                    status: 200,
                    message: 'No results found to be updated.'
                });
            }
        }

        createConnection(db => {
            db.collection(params.table).findOneAndUpdate(params.filter ? params.filter : {}, {
                $set: params.newData
            }, { new: true }, (err, res) => {
                if (err) {
                    reject({ status: 412, message: `Put | ${err.message}` })
                } else {
                    resolve({
                        status: 200,
                        content: res.value,
                        message: 'Successfully updated'
                    })
                }
            })
        })
    })
}