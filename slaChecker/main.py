from check_connection import check_connection
from check_login import check_login, check_logout
from check_search import check_search
from check_sendmsg import check_sendmsg
from check_cart import check_cart

def main():
    check_connection()

    check_login()
    check_logout()

    check_search()

    check_sendmsg()

    check_cart()
    return

if __name__ == '__main__':
    main()
