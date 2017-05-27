#!/usr/bin/python2
import os

if os.path.exists('routes/config.js'):
    exit(0)

bank_ip = raw_input('input your ip of bank: ')
bank_port = raw_input('input your port of bank: ')
passphrase = raw_input('input your passpharse of gpg private key: ')
db_pass = open('../rootpw').read()

config_format = ''' // configuration file for global variable
var c = {{}};

// set your PGP password
c.PASSWORD = '{}';

// set your database connection info
c.database = {{
  host : 'localhost',
  database : 'shoppingmalldb',
  user: 'root',
  password : '{}'
}};

// shoppingmall flag path
c.flag_path = '/var/ctf/shoppingmall.flag';

// bank account related script python path
c.bank_ip = '{}'
c.bank_port = '{}'
c.make_account = './bank/make_account.py'
c.check_transaction = './bank/check_transection.py';
c.remove_account = './bank/remove_account.py';

// bank account checking interval (ms)
c.TIME_TO_CHECK = 1000*6;

// Random number for user authentication
c.MAX = 650000;
c.MIN = 0;

module.exports = c;'''

with open('routes/config.js', 'w') as f:
    f.write(config_format.format(passphrase.strip(), db_pass.strip(), bank_ip.strip(), bank_port.strip()))
