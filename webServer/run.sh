#!/bin/bash
./mk_config.py
service mysql restart
DEBUG=webserver* npm start
