# RAMEN 
##(Rest-API-Mongo-Express-Node)
 
### Installation

#### Clone the repository.
```
git clone git@github.com:devlargs/ramen.git
```

#### Edit the port on server.js
```
var port = normalizePort(process.env.PORT || '1234'); //edit this one
app.set('port', port); 
```

#### Modify Configurations on config.js
```
exports.database = {
    url: 'mongodb://localhost:27017',
    name: 'test',
    password: 'admin',
    username: 'admin'
}; //database credentials
exports.encryptionPassword = 'm34j8fhcltu@djchqnsju924uj'; //preferred pass on aes-256-ctr encryption
exports.secretKey = 'secret'; //your preferred secret key on JSON web token
```

#### Install Dependencies (yarn or npm).
```
yarn install
```

#### Then 
```
yarn run dev
```

#### Api Documentations
```
Go to localhost:1234/documentations
```
---------

#### Love Ramen? Donate. 
```
ETH: 0xbF3BdcE331D92de30fBD896DF67517C8fBB6C44f
```
```
BTC: 3P2U1tKGpvg7siXxMiSi3BjQWgV4zxadMK 
```