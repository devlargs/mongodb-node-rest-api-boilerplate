const MongoClient = require('mongodb').MongoClient;
const { database } = require('../config');

let { name, url } = database;

let createConnection = exports.createConnection = (cb) => {
    const options = {};
    return MongoClient.connect(url, options, (_, client) => {
        try {
            const db = client.db(name);
            cb(db);
            client.close();
        } catch (ex) {
            console.log(url);
            console.log(ex);
        }
    });
};

exports.getCollections = (callback) => {
    return createConnection(db => {
        db.listCollections().toArray((err, lists) => {
            lists = lists.map(q => q.name);
            callback(lists);
        })
    })
}
