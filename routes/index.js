var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('<h1>Forbidden 403</h1>')
});

router.get('/authenticate', function (req, res, next) {
  jwt.sign()
})

router.get('/api/:table', function (req, res, next) {
  res.send(req.params.table)
})


module.exports = router;
