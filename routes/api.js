const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { getCollections } = require("../models/database");
const api = require("../models/api");
const { decrypt, encrypt } = require("../models/functions");
const { secretKey } = require("../config");

const generateToken = (payload) => {
    const data = JSON.stringify({
        dateCreated: new Date().toString(),
        exp: Math.floor(Date.now()),
        ...payload
    });
    return jwt.sign(encrypt(data), secretKey);
}

router.post("/authenticate", (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        res.send({ message: "Email is not defined", status: 403 });
    } else if (!password) {
        res.send({ message: "Password is not defined", status: 403 });
    } else {
        api.Get({
            table: "users",
            filter: { email }
        }).then((response) => {
            if (response.lists.length) {
                bcrypt.compare(password, response.lists[0].password, (_, correct) => {
                    if (correct) {
                        res.send({
                            token: generateToken({ userId: response.lists[0]._id }),
                            message: "Successfully authenticated.",
                            status: 200
                        });
                    } else {
                        res.send({ message: "Incorrect password.", status: 403 });
                    }
                });
            } else {
                res.send({ message: "Username does not exist.", status: 404 });
            }
        });
    }
});

router.use((req, res, next) => {
    const token = req.headers.authorization || req.query.token;
    if (token) {
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                res.send({
                    status: 400,
                    message: "Failed to authenticate token."
                });
            } else {
                req.userId = await new Promise((resolve) => {
                    resolve(JSON.parse(decrypt(decoded)).userId);
                });
                next();
            }
        });
    } else {
        res.send({
            status: 403,
            message: "No token provided."
        });
    }
});

router.get("/:table", async (req, res) => {
    const collections = await new Promise((resolve) => {
        getCollections((res) => {
            resolve(res);
        });
    });

    if (req.params.table) {
        if (collections.includes(req.params.table)) {
            api.Get({
                table: req.params.table,
                ...req.query
            }).then((response) => {
                res.send({ ...response });
            }).catch((err) => {
                res.send({ ...err });
            });
        } else {
            res.send({
                message: "Table not found.",
                status: 404
            });
        }
    } else {
        res.send({
            message: "Please enter table.",
            status: 404
        });
    }
});

router.get("/:table/:id", async (req, res) => {
   const collections = await new Promise((resolve) => {
        getCollections((res) => {
            resolve(res);
        });
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
                message: "Table not found.",
                status: 404
            })
        }
    } else {
        res.send({
            message: "Please enter table.",
            status: 404
        });
    }
});

router.post("/:table", (req, res) => {
    api.Post({
        table: req.params.table,
        formData: req.body
    }).then(response => {
        res.send({
            ...response,
            newToken: generateToken({ userId: req.userId })
        });
    }).catch(ex => {
        res.send({ ...ex });
    });
});

router.put("/:table", (_, res) => {
    res.send({ status: 400, message: "Please enter id" })
});

router.put("/:table/:id", (req, res) => {
    api.Put({
        ...req.params,
        newData: req.body.formData
    }).then((response) => {
        res.send({
            ...response,
            newToken: generateToken({ userId: req.userId })
        })
    }).catch((ex) => {
        res.send({ ...ex });
    });
});

router.delete("/:table", (_, res) => res.send({ status: 400, message: "Please enter id to delete" }));

router.delete("/:table/:id", (req, res) => {
    api.Delete({
        ...req.params
    }).then((response) => {
        res.send({
            ...response,
            newToken: generateToken({ userId: req.userId })
        })
    }).catch((ex) => {
        res.send({ ...ex })
    });
});

module.exports = router;