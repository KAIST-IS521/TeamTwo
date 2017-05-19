var express = require('express');
var router = express.Router();
var q = require('./db.js');

/*
 * list mypage message list
 */
router.get('/', function(req, res, next) {

  q.query('SELECT * FROM messages', function( err, result, fields ){
    if (err) {
      console.log(err);
    }
    else {
      var messages = result;
      console.log(result);
      // client.end();

      res.render('mypage', { 'messages' : messages , 'user' : req.session.user });
    }
  });

  q.execute();

});


module.exports = router;