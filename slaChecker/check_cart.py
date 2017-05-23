from config import HOST, PORT, ID, PW
import requests
import colorlog
import logging
import inspect
import sys
import os
import re

colorlog.basicConfig(level=logging.INFO)

def check_cart():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    try:
        data = {
                'id': ID,
                'pw': PW,
               }
        r = requests.post('http://{}:{}/login'.format(HOST, PORT),
                          data=data,
                          allow_redirects=False)

        if 'set-cookie' not in r.headers:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

        cookie = r.headers['set-cookie']
        cookie = [i for i in cookie.split(';') if 'connect.sid' in i][0]

        headers = {
                'Cookie': cookie,
        }

        r = requests.get('http://{}:{}/product/add?product-id=1&product-num=10'.format(HOST, PORT),
                headers=headers)

        if r.status_code != 200:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

        r = requests.get('http://{}:{}/cart'.format(HOST, PORT),
                headers=headers)
        ids = [i.rstrip().lstrip() for i in r.text.split('\n') if 'cart-id' in i]

        for line in ids:
            id_num = map(int, re.findall(r'([0-9]+)', line))
            if len(id_num) != 1:
                continue

            r = requests.post('http://{}:{}/cart/remove'.format(HOST, PORT),
                    headers=headers,
                    data={'cart_id': id_num})

            if r.status_code != 200:
                colorlog.error('"{}" failed'.format(current_function_name))
                os._exit(1)

    except Exception as e:
        colorlog.error('"{}" failed'.format(current_function_name))
        os._exit(2)
        return

    colorlog.info('"{}" passed'.format(current_function_name))
    return

if __name__ == '__main__':
    if len(sys.argv) == 3:
        HOST = sys.argv[1]
        PORT = sys.argv[2]

    check_cart()
    os._exit(0)
