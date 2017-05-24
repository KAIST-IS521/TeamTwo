#!/usr/bin/python2

from socket import *
from time import sleep
import sys

HOST = 'localhost'
PORT = 1588

try:
    if len(sys.argv) != 3:
        print 'Usage: '
        print '{} <id> <pw>'.format(sys.argv[0])
        exit(1)

    ID = sys.argv[1]
    PW = sys.argv[2]

    REMOVE_CMD = '''1
{id}
{pw}
4
{pw}
2
Y

3
'''.format(**{'id' : ID, 'pw' : PW})

    s = socket(AF_INET, SOCK_STREAM)
    s.connect((HOST, PORT))

    s.send(REMOVE_CMD)
    sleep(0.1)
    s.close()
except:
    pass
