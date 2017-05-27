#!/usr/bin/python2

from socket import *
from time import sleep
from commands import getoutput
from base64 import b64encode as b64e
import sys, os
import re

'''
Usage:
    $ ./make_account.py <HOST> <PORT> <PASS>
Output(stdout):
    <random_id> <random_pw>
'''

def recv_until(s, target='\n'):
    res = ''
    while True:
        res += s.recv(1)
        if res.endswith(target):
            break
    return res

def new_account(i, p):
    i = list(i)
    p = list(p)

    for idx in xrange(len(i)):
        if not i[idx].isalnum():
            i[idx] = 'A'

    for idx in xrange(len(p)):
        if not p[idx].isalnum():
            p[idx] = 'A'

    i = 'A' + ''.join(i)
    p = 'A' + ''.join(p)

    s = socket(AF_INET, SOCK_STREAM)
    s.connect((HOST, PORT))

    cmd = '''2
TeamTwo
'''
    s.send(cmd)
    res = recv_until(s, '-----END PGP MESSAGE-----').split('\n')
    for idx, v in enumerate(res):
        if '-----BEGIN PGP MESSAGE-----' in v:
            break
    res = '\n'.join(res[idx:])
    res = getoutput('echo "{}" | gpg -d --passphrase {} --trust-model always'.format(res, PASS))
    res = re.findall(r'(0x[0-9a-f]+)', res)[0]
    res = getoutput('echo "{}" | gpg -e -a -r "TeamTwo" --trust-model always'.format(res))
    print repr(res)

    s.send(res+'\n')
    cmd = '''
{}
{}
a@a.com
01012341234
Y
'''.format(i, p)
    s.send(cmd)
    return (i, p)

assert len(sys.argv) == 4
HOST = sys.argv[1]
PORT = int(sys.argv[2])
PASS = sys.argv[3]

ID_PW_LEN = 9

id_candidate = b64e(os.urandom(ID_PW_LEN))
pw_candidate = b64e(os.urandom(ID_PW_LEN))

ID, PW = new_account(id_candidate, pw_candidate)

print ID, PW
