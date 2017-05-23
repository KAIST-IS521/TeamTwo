from check_connection import check_connection
from check_login import check_login, check_logout

def main():
    check_connection()
    cookie = check_login()
    check_logout(cookie)
    return

if __name__ == '__main__':
    main()
