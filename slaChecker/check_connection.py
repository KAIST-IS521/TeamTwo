from config import HOST, PORT
import requests
import colorlog
import logging
import inspect

colorlog.basicConfig(level=logging.INFO)

def check_connection():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    try:
        r = requests.get('http://{}:{}'.format(HOST, PORT))

        if r.status_code == 200:
            colorlog.info('"{}" passed'.format(current_function_name))
        else:
            colorlog.error('"{}" failed'.format(current_function_name))
    except:
        colorlog.error('"{}" failed'.format(current_function_name))

    return

if __name__ == '__main__':
    check_connection()
