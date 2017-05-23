from config import HOST, PORT
import requests
import colorlog
import logging
import inspect
import sys
import os

colorlog.basicConfig(level=logging.INFO)

def check_connection():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    try:
        r = requests.get('http://{}:{}'.format(HOST, PORT))

        if r.status_code != 200:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

    except:
        colorlog.error('"{}" failed'.format(current_function_name))
        os._exit(2)

    colorlog.info('"{}" passed'.format(current_function_name))
    return

if __name__ == '__main__':
    if len(sys.argv) == 3:
        HOST = sys.argv[1]
        PORT = sys.argv[2]

    check_connection()
    os._exit(0)
