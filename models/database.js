const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';

exports.createConnection = (cb) => {
    return MongoClient.connect('mongodb://localhost:27017', function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db('test');
        cb(db);
        client.close();
    });
}