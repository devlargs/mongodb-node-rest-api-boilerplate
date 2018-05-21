var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../models/database');
var { secretKey } = require('../config');
var bcrypt = require('bcrypt')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('<h1>API IS UP</h1>')
});

router.post('/authenticate', function (req, res, next) {
    console.log(req.body);
    if (!req.body.email) {
        res.send({ message: 'email is not defined', status: 403 })
    } else if (!req.body.password) {
        res.send({ message: 'password is not defined', status: 403 })
    } else {
        db.Get('users', {
            email: req.body.email
        }).then(function (response) {
            if (response.lists.length) {
                bcrypt.compare(req.body.password, response.lists[0].password, function (err, correct) {
                    if (correct) {
                        var token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        }, secretKey);
                        res.send({
                            userId: response.lists[0]._id,
                            token,
                            message: 'Successfully authenticated.',
                            status: 200
                        })
                    } else {
                        res.send({ message: 'Incorrect password.', status: 403 });
                    }
                });
            } else {
                res.send({ message: 'Invalid username' });
            }
        })
    }
});

router.post('/verifyToken', function (req, res, next) {
    try {
        var verify = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjY2MjI4MDYsInVzZXIiOnsiaWQiOiJmdWNraW5nIHBpZWNlIG9mIHNoaXQifSwiYXBwbGljYXRpb25JZCI6ImJhbGFuYXIiLCJpYXQiOjE1MjY2MTkyMDZ9.KZopXPwHQU-Fl9Wl-yV9jUnK-WMqfa4Bz0wV4Ax4VpY', 'secret');
        res.send({ status: 200, verify, message: 'Successfully authenticated.' });
    } catch (ex) {
        res.send({ status: 401, message: ex.message })
    }
});

router.get('/getEntity/:table', function (req, res, next) {
    db.Get(req.params.table).then(function (response) {
        res.send({
            response
        })
    }).catch(function (err) {
        console.log(err)
        res.send({
            err
        })
    })
});

module.exports = router;