const MongoClient = require('mongodb').MongoClient;
const { database } = require('../config');

let { name, url } = database;

exports.createConnection = (cb) => {
    return MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        const db = client.db(name);
        cb(db);
        client.close();
    });
}