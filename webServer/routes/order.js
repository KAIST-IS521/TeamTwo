var express = require('express');
var router = express.Router();

// module for database
var q = require('./db.js');


/* list orders */
router.get('/', function(req, res, next)
{
  q.query('SELECT * FROM orders', function( err, result, fields )
  {
    if (err)
    {
      console.log(err);
    }
    else
    {
      var orders = result;
      console.log(result);
      // client.end();

      res.render('orders', { 'orders' : orders , 'user' : req.session.user });
    }
  });

  q.execute();
});

module.exports = router;