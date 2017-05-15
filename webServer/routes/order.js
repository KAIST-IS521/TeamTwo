var express = require('express');
var router = express.Router();
var q = require('./db.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Sorry... Not integrated yet with Bank system...');
});

module.exports = router;