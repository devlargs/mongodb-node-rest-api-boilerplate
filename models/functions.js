var crypto = require('crypto');
var { encryptionPassword } = require('../config');
var algorithm = 'aes-256-ctr';

exports.encrypt = (text) => {
    var cipher = crypto.createCipher(algorithm, encryptionPassword)
    var c = cipher.update(text, 'utf8', 'hex')
    c += cipher.final('hex');
    return c;
}

exports.decrypt = (hash) => {
    var decipher = crypto.createDecipher(algorithm, encryptionPassword)
    var d = decipher.update(hash, 'hex', 'utf8')
    d += decipher.final('utf8');
    return d;
}