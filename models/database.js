const MongoClient = require('mongodb').MongoClient;
const { database } = require('../config');

let { name, url } = database;

let createConnection = exports.createConnection = (cb) => {
    return MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        const db = client.db(name);
        cb(db);
        client.close();
    });
};

let getCollections = exports.getCollections = (callback) => {
    return createConnection(db => {
        db.listCollections().toArray((err, lists) => {
            lists = lists.map(q => q.name);
            callback(lists);
        })
    })
}
