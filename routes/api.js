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

router.use(function (req, res, next) {
    var token = req.headers.authorization || req.query.token;
    if (token) {
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.send({
                    status: 412,
                    message: 'Failed to authenticate token.'
                });
            } else {
                next();
            }
        });
    } else {
        res.send({
            status: 403,
            message: 'No token provided.'
        });
    }
});

router.get('/getEntity/:table', function (req, res, next) {
    db.Get(req.params.table).then(function (response) {
        res.send({ response })
    }).catch(function (err) {
        res.send({ err })
    })
});

module.exports = router;