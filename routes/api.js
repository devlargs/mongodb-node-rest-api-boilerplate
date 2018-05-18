var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../models/database');
var assert = require('assert')

var connect = db.createConnection(function (q) {
    // return q;
    var collection = q.collection('users')
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
    })
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('<h1>API IS UP</h1>')
});

router.post('/getToken', function (req, res, next) {
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        user: {
            id: 'fucking piece of shit'
        },
        applicationId: 'balanar'
    }, 'secret');
    res.send({ token });
});

router.post('/verifyToken', function (req, res, next) {
    try {
        var verify = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjY2MjI4MDYsInVzZXIiOnsiaWQiOiJmdWNraW5nIHBpZWNlIG9mIHNoaXQifSwiYXBwbGljYXRpb25JZCI6ImJhbGFuYXIiLCJpYXQiOjE1MjY2MTkyMDZ9.KZopXPwHQU-Fl9Wl-yV9jUnK-WMqfa4Bz0wV4Ax4VpY', 'secret');
        res.send({ status: 200, verify, message: 'Successfully authenticated.' })
    } catch (ex) {
        res.send({ status: 401, message: ex.message })
    }

    // res.send({
    //   verify
    // })
});

router.get('/db', function (req, res, next) {

})

module.exports = router;