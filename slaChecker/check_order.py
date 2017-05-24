from config import HOST, PORT, ID, PW
import requests
from bs4 import BeautifulSoup
import colorlog
import logging
import inspect
import sys
import os
import re
from time import sleep

colorlog.basicConfig(level=logging.INFO)


def login():
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

        headers = {'Cookie': cookie}

        return headers

    except:
        colorlog.error('login failed')
        os._exit(2)
        return

def check_order():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    headers = login()

    try:
        # add to cart
        r = requests.get('http://{}:{}/product/purchase?product-id=1&product-num=1'.format(HOST, PORT),
                         headers=headers)

        if r.status_code != 200:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

        r = requests.get('http://{}:{}/product/add?product-id=2&product-num=2'.format(HOST, PORT),
                         headers=headers)

        if r.status_code != 200:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

        r = requests.get('http://{}:{}/cart/purchase'.format(HOST, PORT),
                         headers=headers)

        # check orders
        r = requests.get('http://{}:{}/order'.format(HOST, PORT),
                         headers=headers)

        soup = BeautifulSoup(r.text, 'html.parser')
        orders = soup.find_all(class_='order-status')

        # check number of orders
        if len(orders) < 2:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

        # check order status
        for o in orders:
            if o.string.strip() != 'pending':
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

    check_order()
    os._exit(0)
