from config import HOST, PORT, ID, PW
import requests
import colorlog
import logging
import inspect
import sys
import os

colorlog.basicConfig(level=logging.INFO)
CONTAIN = [
        'HORDE',
        'THE RESTORANTS',
        'KOREAN TRUCK SIMULATOR',
]

NOT_CONTAIN = [
        'DIABLO MOUNTAIN',
        'FLAG',
        'PLANET CRAFT 2',
        'REAL WATCH',
]

def check_search():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    try:
        r = requests.get('http://{}:{}/search?keyword=or'.format(HOST, PORT))
        body = r.text

        if any(c not in body for c in CONTAIN) or any(nc in body for nc in NOT_CONTAIN):
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

    check_search()
    os._exit(0)
