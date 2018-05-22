var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var api = require('../models/api');
var { decrypt, encrypt } = require('../models/functions');
var { encryptionPassword, secretKey } = require('../config');

router.get('/', function (req, res, next) {
    res.send('<h1>API IS UP</h1>')
});

router.post('/authenticate', function (req, res, next) {
    if (!req.body.email) {
        res.send({ message: 'email is not defined', status: 403 })
    } else if (!req.body.password) {
        res.send({ message: 'password is not defined', status: 403 })
    } else {
        api.Get('users', {
            email: req.body.email
        }).then(function (response) {
            if (response.lists.length) {
                bcrypt.compare(req.body.password, response.lists[0].password, function (err, correct) {
                    if (correct) {
                        var token = jwt.sign({
                            dateCreated: new Date().toString(),
                            userId: response.lists[0]._id,
                            exp: Math.floor(Date.now()),
                        }, secretKey);
                        res.send({
                            token: encrypt(token),
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
        jwt.verify(decrypt(token), secretKey, function (err, decoded) {
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
    api.Get({
        table: req.params.table,
        ...req.query
    }).then((response) => {
        res.send({ ...response })
    }).catch((err) => {
        res.send({ err })
    });
});

router.post('/postEntity/:table', function (req, res, next) {
    api.Post({
        table: req.params.table,
        formData: {
            name: 'Ralph Largo',
            age: 22,
            sexPartner: 'Jolina Estabillo'
        }
    }).then(response => {
        res.send({ ...response })
    }).catch(err => {
        res.send({
            err
        })
    })
})

module.exports = router;