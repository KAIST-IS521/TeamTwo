# SLA checker for web app

## pre-installed
```
# pip2 install requests
# pip2 install colorlog
# pip2 install beautifulsoup4
```
Also, they are installed by up-level Makefile

## How to use
In this directory, there are several programs for SLA checking.

Here is a list for them
- `check_connection.py`
- `check_login.py`
- `check_search.py`
- `check_sendmsg.py`
- `check_cart.py`
- `check_order.py`

Before run, you must check `config.py` and change ID, PW field.

In general you can run these scripts with follong commands:
```
$ python2 check_<name>.py <ip> <port>
```

When you want to run all scripts:
```
$ python2 main.py
```
But this script is not following specification, so if you want to check
return code, DO NOT use `main.py`
