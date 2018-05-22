const MongoClient = require('mongodb').MongoClient;
const { databaseCredentials } = require('../config');

let { name, url } = databaseCredentials;

exports.createConnection = (cb) => {
    return MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        const db = client.db(name);
        cb(db);
        client.close();
    });
}