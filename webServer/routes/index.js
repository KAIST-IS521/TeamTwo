var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



// node-mysql
var mysql = require('mysql');
var client = mysql.createConnection({ 
  host : 'localhost',
  database : 'sktiotdb',
  user: 'is521',
  password : 'is521'
});
  
// running queries as normal...
client.query('USE shoppingmall');

// mysql-queues
var queues = require('mysql-queues');
const DEBUG = true;
queues(client, DEBUG);
var q = client.createQueue();

/* login */
router.post('/login', function(req, res, next) {

    var id = req.param('id'); 
    var pw = req.param('pw'); 

    // SQL query for checking id, pw 
    var qString = 'SELECT users.user_id AS id \
                  FROM users \
                  WHERE users.user_id = ? AND users.passwd = ?' ; 

    console.log(qString); 

    q.query( qString, [ id, pw ], function( err, result, fields ){
        if (err) {
          console.log(err); 
        }
        else {
          	console.log(result);
          
            // log-in success 
          	if (result.length == 1 ) {
                req.session.regenerate(function(){
                    console.log(result[0].id);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    req.session.user = result[0].id;  
                    res.redirect('/user');
                });
            }
            else {
             	res.redirect('/');   
            }
    	}
    }); 

    q.execute(); 
});

/* logout */
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    res.redirect('/');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  });    
});

module.exports = router;
