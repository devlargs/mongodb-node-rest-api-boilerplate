const { createConnection } = require('./database')

exports.Get = (params) => {
    return new Promise((resolve, reject) => {
        if (params.table) {
            var connect = createConnection((q) => {
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
        } else {
            reject({ message: 'Invalid entity', status: 412 })
        }
    });
};