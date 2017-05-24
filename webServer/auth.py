#!/usr/bin/python2

import os
from commands import getoutput
import sys

print 'Paste challenge and press Ctrl-D'
inp = sys.stdin.read()

res = getoutput('echo "{}" | gpg -d'.format(inp))
random_number = res.split('\n')[-1].lstrip().rstrip()

res = getoutput('echo "{}" | gpg --encrypt -r "TeamTwo@kaist.ac.kr" --armor --trust-model always'.format(random_number))

print
print
print
print
print
print
print
print res
