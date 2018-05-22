var parseObjectId = require('mongodb').ObjectId;
var { createConnection } = require('./database')
var _ = require('lodash');
var moment = require('moment');

exports.Get = (params) => {
    if (params.id) {
        params.filter = {
            _id: parseObjectId(params.id)
        }
    }

    return new Promise((resolve, reject) => {
        createConnection((q) => {
            q.collection(params.table).find(params.filter ? params.filter : {}).toArray((err, lists) => {
                if (err) {
                    reject({ err, status: 412 })
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
                        status: 200
                    })
                }
            });
        })
    });
};