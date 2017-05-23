from config import HOST, PORT
import requests
import colorlog
import logging
import inspect

colorlog.basicConfig(level=logging.INFO)

def check_login():
    frame = inspect.currentframe()
    current_function_name = inspect.getframeinfo(frame).function

    try:
        data = {
                'id': 'test',
                'pw': 'test',
               }
        r = requests.post('http://{}:{}/login'.format(HOST, PORT),
                          data=data,
                          allow_redirects=False)

        if 'set-cookie' not in r.headers:
            colorlog.error('"{}" failed'.format(current_function_name))
            return

        cookie = r.headers['set-cookie']

    except:
        colorlog.error('"{}" failed'.format(current_function_name))
        return

    colorlog.info('"{}" passed'.format(current_function_name))
    return cookie

def check_logout(cookie):
    return

if __name__ == '__main__':
    cookie = check_login()
    check_logout(cookie)
