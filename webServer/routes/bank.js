// modules
var cp = require('child_process');
var config = require('./config.js');
var q = require('./db.js');

var bank = {};


/*
 * This function is called as a callback function 1 minute after purchasing item.
 */
bank.checkBankAccount = function( )
{
	var sString = 'SELECT * FROM orders WHERE status = "pending"';

	// // update the status in order table
 //    q.query( sString, function( err, result, fields )
 //    {
 //        // when SQL error
 //        if (err) {
 //            console.log(err);
 //            return;
 //        }

	// 	// when SQL success
	// 	var item = result[0];

	// 	console.log(item)

	    // check_transaction.py excution.
	    cp.exec( config.check_transaction + ' ' + 'test1' + ' ' + 'test' + ' 1000', function( error, stdout, stderr )
	    {
	        // execution error
	        if (error) {
	            console.error(error);
	            return;
	        }

	        console.log(stdout);
	        console.log(stdout.toString());
	        console.log(stdout.toString().substring(0,7));

			// SQL query for updating status
	        if ( stdout.toString().substring(0,6) == 'success' ) {
	        	// var uString = 'UPDATE orders SET status = "completed" WHERE order_id = ? ';
	        	var uString = 'UPDATE orders SET status = "completed"';

	        	// update the status in order table
		        q.query( uString, /* [ item.order_id ],*/ function( err, result, fields )
		        {
		            // when SQL error
		            if (err) {
		                console.log(err);
		                return;
		            }

		            // when SQL success
		            console.log(result);
		            return;
		        });

		        q.execute();
	        }
	        // else {
	        	// var uString = 'UPDATE orders SET status = "abort" WHERE order_id = ? ';
	       		var uString = 'UPDATE orders SET status = "abort"';

	        	// update the status in order table
		        q.query( uString, /* [ item.order_id ],*/ function( err, result, fields )
		        {
		            // when SQL error
		            if (err) {
		                console.log(err);
		                return;
		            }

		            // when SQL success
		            console.log(result);

	       //    	    // remove_account.py excution.
				    // cp.exec( config.remove_account + ' ' + item.bank_account + ' ' + item.bank_pw, function( error, stdout, stderr )
				    // {
				    //     // execution error
				    //     if (error) {
				    //         console.error(error);
				    //         return;
				    //     }

				    //     console.log(stdout);
				    //     return;
				    // }); // end exec
		        }); // end SQL query
	        // } // end else
	    }); // end exec

	// }); // end SQL query
};


module.exports = bank;