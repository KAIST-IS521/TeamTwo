from check_connection import check_connection
from check_login import check_login, check_logout, check_auth
from check_search import check_search
from check_sendmsg import check_sendmsg
from check_cart import check_cart
from check_order import check_order

def main():
    # run all tests
    check_connection()

    check_login()
    check_logout()
    check_auth()

    check_search()

    check_sendmsg()

    check_cart()

    check_order()
    return

if __name__ == '__main__':
    main()
