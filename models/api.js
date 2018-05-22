const { createConnection } = require('./database')

exports.Get = (params) => {
    console.log(params, "PARAMS")
    return new Promise((resolve, reject) => {
        createConnection((q) => {
            q.collection(params.table).find(params.filter ? params.filter : {}).toArray((err, lists) => {
                if (err) {
                    reject({ err, status: 412 })
                } else {
                    resolve({
                        length: lists.length,
                        lists,
                        status: 200
                    })
                }
            });
        })
    });
};