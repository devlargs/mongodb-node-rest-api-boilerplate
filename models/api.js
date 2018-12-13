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
                reject({
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
    const date = moment().format();
    return new Promise((resolve, reject) => {
        createConnection(db => {
            if(typeof params.formData === "string") {
                try {
                    params.formData = JSON.parse(params.formData);
                } catch (ex) { 
                    reject({ status: 400, message: "Please send a stringified object or raw object data." })
                }
            }

            params.formData = { 
                ...params.formData, 
                dateCreated: date,
                dateUpdated: date
            }

            db.collection(params.table).insertOne({ ...params.formData }, (err, lists) => {
                if (err) {
                    reject({ status: 412, message: `Post | ${err.message}` })
                } else {
                    resolve({
                        data: lists.ops,
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
                reject({
                    status: 304,
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

exports.Delete = (params) => {
    return new Promise((resolve, reject) => {
        if (params.id) {
            try {
                params.filter = {
                    _id: parseObjectId(params.id)
                }
            } catch (ex) {
                reject({
                    status: 304,
                    message: 'No results found to be updated.'
                });
            }
        }

        createConnection(db => {
            db.collection(params.table).deleteOne(params.filter ? params.filter : {}, function (err, obj) {
                console.log(err)

                if (err) {
                    reject({ status: 412, message: `Delete | ${err.message}` })
                } else {
                    if (obj.deletedCount) {
                        resolve({
                            status: 200,
                            id: params.id,
                            message: 'Successfully deleted'
                        })
                    } else {
                        reject({
                            status: 400,
                            message: 'No results found to be deleted.'
                        })
                    }
                }
            })
        })
    })
}