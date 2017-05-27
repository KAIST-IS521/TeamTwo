#!/usr/bin/python2

'''
Usage:
    $ ./check_transection.py <HOST> <PORT> <id> <pw> <expected_money>
    result: success/fail (stdout)
'''

from socket import *
from time import sleep
import sys, re

def recv_until(s, char):
    res = ''
    while True:
        res += s.recv(1)
        if res.endswith(char):
            break
    return res

def check_line_by_line(s, keyword):
    while True:
        res = recv_until(s, '\n')
        if keyword in res:
            break
    return res

try:
    HOST = 'localhost'
    PORT = 1588

    if len(sys.argv) != 6:
        print 'Usage: '
        print '{} <HOST> <PORT> <id> <pw> <expected-money>'.format(sys.argv[0])
        exit(1)

    HOST = sys.argv[1]
    PORT = int(sys.argv[2])
    ID = sys.argv[3]
    PW = sys.argv[4]
    E_MONEY = int(sys.argv[5])

    GET_MONEY_CMD = '''1
{id}
{pw}
1

5
3
'''.format(**{'id': ID, 'pw': PW})

    s = socket(AF_INET, SOCK_STREAM)
    s.connect((HOST, PORT))
    s.send(GET_MONEY_CMD)

    res = check_line_by_line(s, 'Balance')
    res = check_line_by_line(s, 'Balance')

    balance = int(re.findall(r'([0-9]+)', res)[-1])
    s.close()
except:
    print 'fail'
    exit(0)

if balance >= E_MONEY:
    print 'success'
    exit(0)
else:
    print 'fail'
    exit(0)
