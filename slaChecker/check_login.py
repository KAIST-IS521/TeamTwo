from config import HOST, PORT, ID, PW
import requests
import colorlog
import logging
import inspect
import sys
import os

colorlog.basicConfig(level=logging.INFO)

def check_login():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    try:
        # checks valid login process
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

        # checks invalid login process
        data = {
                'id': 'asjdkfl;as',
                'pw': 'qwueioprq'
        }

        r = requests.post('http://{}:{}/login'.format(HOST, PORT),
                          data=data,
                          allow_redirects=False)

        if 'set-cookie' in r.headers:
            colorlog.error('"{}" failed'.format(current_function_name))
            os._exit(1)

    except:
        colorlog.error('"{}" failed'.format(current_function_name))
        os._exit(2)

    colorlog.info('"{}" passed'.format(current_function_name))
    return

def check_logout():
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
        r = requests.get('http://{}:{}/logout'.format(HOST, PORT),
                headers=headers)

        if r.status_code == 304:
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

    check_login()
    check_logout()
    os._exit(0)
