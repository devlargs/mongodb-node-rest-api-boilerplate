const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { databaseCredentials } = require('./config');

let { name, url } = databaseCredentials;

// Connection URL
var createConnection = (cb) => {
    return MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        const db = client.db(name);
        cb(db);
        client.close();
    });
}

exports.Get = (table, callback) => {
    var connect = createConnection(function (q) {
        var collection = q.collection('users');
        collection.find({}).toArray(function (err, docs) {
            if (err) {
                callback({
                    err: err,
                    status: 403
                })
            } else {
                callback({
                    data: docs,
                    status: 200
                })
            }
        });
    });
}