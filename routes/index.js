const router = require('express').Router();

router.get('/', (_, res) => {
  res.redirect('/documentations')
});

module.exports = router;
