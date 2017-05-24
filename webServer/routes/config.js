// configuration file for global variable
var c = {};

// set your PGP password
c.PASSWORD = '******';

// set your database connection info
c.database = {
  host : 'localhost',
  database : 'shoppingmalldb',
  user: 'root',
  password : 'is521'
};

// shoppingmall flag path
c.flag_path = '/var/ctf/shoppingmall.flag';

// bank account related script python path
c.make_account = './bank/make_account.py'
c.check_transaction = './bank/check_transection.py';
c.remove_account = './bank/remove_account.py';

// bank account checking interval (ms)
c.TIME_TO_CHECK = 1000*6;

// Random number for user authentication
c.MAX = 650000;
c.MIN = 0;

module.exports = c;