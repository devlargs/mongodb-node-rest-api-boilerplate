var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var { getCollections } = require('../models/database');

var api = require('../models/api');
var { decrypt, encrypt } = require('../models/functions');
var { secretKey } = require('../config');

var generateToken = (payload) => {
    let data = JSON.stringify({
        dateCreated: new Date().toString(),
        exp: Math.floor(Date.now()),
        ...payload
    })
    return jwt.sign(encrypt(data), secretKey);
}

router.get('/', function (req, res, next) {
    res.send('<h1>API IS UP</h1>')
});

router.post('/authenticate', function (req, res, next) {
    /**
     * @api {POST} /authenticate Get Token
     * @apiGroup Authentication
     *
     * @apiParam {String} email Users email address
     * @apiParam {String} password Users password
     *
     * @apiSuccess {String} token Used for Authorization header on request
    */

    if (!req.body.email) {
        res.send({ message: 'email is not defined', status: 403 })
    } else if (!req.body.password) {
        res.send({ message: 'password is not defined', status: 403 })
    } else {
        api.Get({
            table: 'users',
            filter: {
                email: req.body.email
            }
        }).then(function (response) {
            if (response.lists.length) {
                bcrypt.compare(req.body.password, response.lists[0].password, function (err, correct) {
                    if (correct) {
                        res.send({
                            token: generateToken({ userId: response.lists[0]._id }),
                            message: 'Successfully authenticated.',
                            status: 200
                        })
                    } else {
                        res.send({ message: 'Incorrect password.', status: 403 });
                    }
                });
            } else {
                res.send({ message: 'Username does not exist.', status: 404 });
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
                getCollections(coll => {
                    req.collections = coll;
                    decoded = (JSON.parse(decrypt(decoded)))
                    req.userId = decoded.userId;
                    next();
                });
            }
        });
    } else {
        res.send({
            status: 403,
            message: 'No token provided.'
        });
    }
});

router.get('/getEntity/:table', async function (req, res) {
    const collections = await new Promise((resolve) => {
        getCollections((res) => {
            resolve(res);
        })
    });

    if (req.params.table) {
        if (collections.includes(req.params.table)) {
            api.Get({
                table: req.params.table,
                ...req.query
            }).then((response) => {
                res.send({ ...response })
            }).catch((err) => {
                res.send({ ...err })
            });
        } else {
            res.send({
                message: 'Table not found.',
                status: 404
            })
        }
    } else {
        res.send({
            message: 'Please enter table.',
            status: 404
        })
    }
});

router.get('/getEntity/:table/:id', async function (req, res, next) {
    /**
     * @api {GET} /getEntity/:table/:id Get Entity
     * @apiGroup Entities
     *
     * @apiParam (Query) {String} table Specify database table/collection
     * @apiParam (Query) {String} [id] Pass it on /getEntity/:table/:id if you want to return specific data
     *
     * @apiParam (Body) {Object} [filter] Pass specific attributes to return filtered queries. e.g. { address: 'Makati'}
     * @apiParam (Body) {Object} [fields] Pass this to return specific attributes that you only need. e.g. ['Name', 'Address'] returns [{Name: '', Address: ''}, ...{ and_so_on }] only
     * 
     * @apiHeader {String} Authorization Insert generated token here to validate request.
     * 
     * @apiSuccess {Number} length Length of the response
     * @apiSuccess {Object} lists Response content
     * 
    */

   const collections = await new Promise((resolve) => {
        getCollections((res) => {
            resolve(res);
        })
    });

    if (req.params.table) {
        if (collections.includes(req.params.table)) {
            api.Get({
                table: req.params.table,
                id: req.params.id,
                ...req.query
            }).then((response) => {
                res.send({ ...response })
            }).catch((err) => {
                res.send({ ...err })
            });
        } else {
            res.send({
                message: 'Table not found.',
                status: 404
            })
        }
    } else {
        res.send({
            message: 'Please enter table.',
            status: 404
        })
    }
});

router.post('/postEntity/:table', function (req, res) {
    /**
     * @api {POST} /postEntity/:table Post Entity
     * @apiGroup Entities
     *
     * @apiParam (Query) {String} table Specify database table/collection
     *
     * @apiParam (Body) {Object} formData All things to be added
     * 
     * @apiHeader {String} Authorization Insert generated token here to validate request.
     * 
     * @apiSuccess {Number} length Length of the response
     * @apiSuccess {Object} lists Response content
     * 
    */
    api.Post({
        table: req.params.table,
        formData: req.body
    }).then(response => {
        res.send({
            ...response,
            newToken: generateToken({ userId: req.userId })
        })
    }).catch(ex => {
        res.send({ ...ex })
    })
});

router.put('/putEntity/:table/:id', function (req, res, next) {
    /**
     * @api {PUT} /putEntity/:table/:id Put Entity
     * @apiGroup Entities
     *
     * @apiParam (Query) {String} table Specify database table/collection
     * @apiParam (Query) {String} id Specify id to be edited
     *
     * @apiParam (Body) {Object} formData Payload object that determines all fields to be edited
     * 
     * @apiHeader {String} Authorization Insert generated token here to validate request.
     * 
     * @apiSuccess {Number} length Length of the response
     * @apiSuccess {Object} lists Response content
     * 
    */
    api.Put({
        ...req.params,
        newData: req.body.formData
    }).then(function (response) {
        res.send({
            ...response,
            newToken: generateToken({ userId: req.userId })
        })
    }).catch(function (ex) {
        res.send({ ...ex })
    })
});

router.delete('/deleteEntity/:table/:id', function (req, res, next) {
    /**
     * @api {DELETE} /putEntity/:table/:id Delete Entity
     * @apiGroup Entities
     *
     * @apiParam (Query) {String} table Specify database table/collection
     * @apiParam (Query) {String} id Specify id to be deleted
     *
     * @apiHeader {String} Authorization Insert generated token here to validate request.
     * 
     * @apiSuccess {String} id Deleted object id
     * 
    */

    api.Delete({
        ...req.params
    }).then(function (response) {
        res.send({
            ...response,
            newToken: generateToken({ userId: req.userId })
        })
    }).catch(function (ex) {
        res.send({ ...ex })
    })
})

module.exports = router;