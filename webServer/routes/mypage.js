// basic module for web app
var express = require('express');
var router = express.Router();

// module for database
var q = require('./db.js');

/*
 * This function lists message list in mypage.
 */
router.get('/', function(req, res, next)
{
    // SQL query for listing messages
    q.query('SELECT * FROM messages', function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
        }
        // when SQL success
        else {
            var messages = result;
            console.log(result);

            // show mypage.ejs
            res.render('mypage', { 'messages' : messages , 'user' : req.session.user });
        }
    });

    // SQL execute
    q.execute();
});


module.exports = router;