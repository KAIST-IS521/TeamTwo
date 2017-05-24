#!/usr/bin/python2
import os
from base64 import b64encode as b64e

pw = list(b64e(os.urandom(12)))
for i, v in enumerate(pw):
    if not v.isalnum():
        pw[i] = 'A'

with open('../rootpw', 'w') as f:
    f.write('A' + ''.join(pw))
