const crypto = require('crypto');
const { encryptionPassword } = require('../config');
const algorithm = 'aes-256-ctr';

exports.encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, encryptionPassword);
    let c = cipher.update(text, 'utf8', 'hex');
    c += cipher.final('hex');
    return c.split('').reverse().join('');
}

exports.decrypt = (hash) => {
    const decipher = crypto.createDecipher(algorithm, encryptionPassword);
    let d = decipher.update(hash.split('').reverse().join(''), 'hex', 'utf8');
    d += decipher.final('utf8');
    return d;
}

exports.memorySize = (obj) => {
    let bytes = 0;

    const sizeOf = (obj) => {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    const objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (let key in obj) {
                            if (!obj.hasOwnProperty(key)) continue;
                            sizeOf(obj[key]);
                        }
                    } else bytes += obj.toString().length * 2;
                    break;
            }
        }
        return bytes;
    };

    let formatByteSize = (bytes) => {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
        else return (bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};