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

  //updateUserBankID(2);
});

function getUserBankID()
{
    // bank connected needed
    return "dummy_bank_id";
}

function updateUserBankID(order_id)
{
  var userBankID = getUserBankID();
  var uString = 'UPDATE orders SET bank_id = \'' + String(userBankID) + '\' WHERE order_id = ' + String(order_id);
  q.query(uString, function( err, result, fields )
  {
    if (err)
    {
      console.log(err);
    }
    else
    {
      console.log(result);
      res.json( { status: 1, message: 'Updated the user\'s bank id' } );
    }
  });

  q.execute();
}


module.exports = router;