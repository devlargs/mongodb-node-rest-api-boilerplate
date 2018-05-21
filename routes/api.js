var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../models/database');

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
});

router.get('/getEntity/:table', function (req, res, next) {
    db.Get(req.params.table, function(response){
        res.send({response})
    })
})

module.exports = router;