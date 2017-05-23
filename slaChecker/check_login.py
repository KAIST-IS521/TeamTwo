from config import HOST, PORT, ID, PW
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
                'id': ID,
                'pw': PW,
               }
        r = requests.post('http://{}:{}/login'.format(HOST, PORT),
                          data=data,
                          allow_redirects=False)

        if 'set-cookie' not in r.headers:
            colorlog.error('"{}" failed'.format(current_function_name))
            exit(1)
            return

        cookie = r.headers['set-cookie']

    except requests.exceptions.ConnectionError:
        colorlog.error('"{}" failed'.format(current_function_name))
        exit(2)
        return

    colorlog.info('"{}" passed'.format(current_function_name))
    return cookie

def check_logout(cookie):
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
            exit(1)
            return

        cookie = r.headers['set-cookie']
        cookie = [i for i in cookie.split(';') if 'connect.sid' in i][0]

        headers = {
                'Cookie': cookie,
                }
        r = requests.get('http://{}:{}/logout'.format(HOST, PORT),
                headers=headers)

        if r.status_code == 304:
            colorlog.error('"{}" failed'.format(current_function_name))
            exit(1)
            return

    except requests.exceptions.ConnectionError:
        colorlog.error('"{}" failed'.format(current_function_name))
        exit(2)
        return

    colorlog.info('"{}" passed'.format(current_function_name))
    return

if __name__ == '__main__':
    cookie = check_login()
    check_logout(cookie)
    exit(0)
