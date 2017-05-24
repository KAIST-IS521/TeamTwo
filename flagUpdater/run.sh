#!/bin/bash

# turn of std buffering with `stdbuf`
# this makes sure all logs are included when the program is interrupted
stdbuf -i0 -o0 -e0 build/flagUpdater $1 > flagUpdater.log 2>&1
