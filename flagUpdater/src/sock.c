#include "sock.h"

int sock_open(const char* ip, int port)
{
    int ret;
    int sockfd;
    int opt_val;
    struct sockaddr_in addr;

    /* setup socket */
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd  == -1) {
        log_perr("socket");
        return -1;
    }

    /* set options */
    opt_val = 1;
    ret = setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &opt_val, sizeof(int));
    if (ret == -1) {
        log_perr("setsockopt");
        sock_close(sockfd);
        return -1;
    }

    /* TODO: set timeout */

    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = inet_addr(ip);

    /* bind address */
    ret = bind(sockfd, (struct sockaddr *) &addr, sizeof(addr));
    if (ret == -1) {
        log_perr("bind");
        close(sockfd);
        return -1;
    }

    return sockfd;
}

int sock_listen(int sockfd, sock_listen_cb_t cb)
{
    int ret;
    int cli_fd;
    struct sockaddr_in cli_addr;
    socklen_t cli_len = sizeof(cli_addr);

    ret = listen(sockfd, SOMAXCONN);
    if (ret != 0) {
        log_perr("listen");
        return -1;
    }

    while (1) {
        /* accept connection */
        cli_fd = accept(sockfd, (struct sockaddr *) &cli_addr, &cli_len);
        if (cli_fd == -1) {
            log_perr("accept");
            continue;
        }

        cb(cli_fd);

        ret = sock_close(cli_fd);
        if (ret < 0) {
            return -1;
        }
    }

    return 0;
}

int sock_read(int sockfd, char *buffer, size_t size)
{
    int ret, i;
    char c;

    /* read until buffer capacity is reached */
    i = 0;
    while((size_t) i < size) {
        /* read char by char */
        ret = recv(sockfd, &c, 1, 0);
        if (ret != 1) {
            log_perr("recv");
            return -1;
        }

        /* store in destination buffer */
        buffer[ret] = c;
        i++;

        /* read til newline given */
        if(c == '\n')
            break;
    }

    /* close string in buffer */
    if (i > 0)
        buffer[i - 1] = '\0';

    return 0;
}

int sock_write(int sockfd, char *buffer, size_t size)
{
    int ret;

    ret = send(sockfd, buffer, size, 0);
    if (ret < 0) {
        log_perr("on send");
        return -1;
    }

    return 0;
}

int sock_close(int sockfd)
{
    int ret;

    ret = close(sockfd);
    if (ret != 0) {
        log_perr("close");
        return -1;
    }

    return 0;
}
