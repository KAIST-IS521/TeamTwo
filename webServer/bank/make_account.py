#!/usr/bin/python2

from socket import *
from time import sleep
import sys, os
from base64 import b64encode as b64e

'''
Usage:
    $ ./make_account.py

Output(stdout):
    <random_id>
    <random_pw>
'''

def new_account(i, p):
    # TODO: Since TeamOne's implementation is not completed yet,
    #       this stuff would be postponed

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

    return (i, p)

HOST = 'localhost'
PORT = 1588

ID_PW_LEN = 9

id_candidate = b64e(os.urandom(ID_PW_LEN))
pw_candidate = b64e(os.urandom(ID_PW_LEN))

ID, PW = new_account(id_candidate, pw_candidate)

print ID, PW
