
const { MONGODB_PASSWORD, MONGODB_USERNAME } = process.env;

exports.database = {
    url: `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0-shard-00-00-fprc1.mongodb.net:27017,cluster0-shard-00-01-fprc1.mongodb.net:27017,cluster0-shard-00-02-fprc1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`,
    name: 'campusfiles',
    password: MONGODB_PASSWORD,
    username: MONGODB_USERNAME
};
exports.encryptionPassword = 'm34j8fhcltu@djchqnsju924uj';
exports.secretKey = 'secret';