from config import HOST, PORT
import requests
import colorlog
import logging
import inspect
import sys
import os

colorlog.basicConfig(level=logging.INFO)

def logout():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    try:
        r = requests.get('http://{}:{}/logout'.format(HOST, PORT))

        if r.status_code == 304:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

    except:
        colorlog.error('"{}" failed'.format(current_function_name))
        os._exit(2)

def check_auth():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    logout()

    restricted_pages = ['order', 'cart', 'mypage']

    for page in restricted_pages:
        r = requests.get('http://{}:{}/order'.format(HOST, PORT))

        if r.url != 'http://{}:{}/'.format(HOST, PORT):
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(2)

    colorlog.info('"{}" passed'.format(current_function_name))

if __name__ == '__main__':
    if len(sys.argv) == 3:
        HOST = sys.argv[1]
        PORT = sys.argv[2]

    check_auth()

    os._exit(0)
