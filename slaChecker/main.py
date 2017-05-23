from check_connection import check_connection
from check_login import check_login, check_logout
from check_search import check_search

def main():
    check_connection()

    cookie = check_login()
    check_logout(cookie)

    check_search()
    return

if __name__ == '__main__':
    main()
