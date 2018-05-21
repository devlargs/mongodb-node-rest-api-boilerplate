const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { databaseCredentials } = require('../config');

let { name, url } = databaseCredentials;

var createConnection = (cb) => {
    return MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        const db = client.db(name);
        cb(db);
        client.close();
    });
}

exports.Get = (table) => {
    return new Promise((resolve, reject) => {
        if (table) {
            var connect = createConnection((q) => {
                q.collection(table).find({}).toArray((err, lists) => {
                    if (err) {
                        reject({ err, status: 403 })
                    } else {
                        resolve({ lists, status: 200 })
                    }
                })
            })
        } else {
            reject({ message: 'Invalid table' })
        }

    })
}