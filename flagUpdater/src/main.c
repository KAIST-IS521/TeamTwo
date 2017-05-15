#include <stdlib.h>
#include <stdio.h>

#include "logger.h"
#include "ip.h"
#include "sock.h"

int main(int argc, char *argv[])
{
    int ret;
    char *ip;
    int port;

    int srv_fd, cli_fd;
    struct sockaddr_in cli_addr;
    socklen_t cli_len = sizeof(cli_addr);

    if (argc < 3) {
        log_errf("usage: %s <ip> <port>", argv[0]);
        exit(EXIT_FAILURE);
    }

    /* parse ip */
    ip = strdup(argv[1]);
    if (!ip_valid(ip)) {
        log_errf("failed to parse ip '%s'", ip);
        exit(EXIT_FAILURE);
    }

    /* parse port */
    port = atoi(argv[2]);

    /* open socket */
    srv_fd = sock_open(ip, port);
    if (srv_fd < 0) {
        log_err("failed to open socket");
        exit(EXIT_FAILURE);
    }

    /* listen to socket */
    ret = listen(srv_fd, SOMAXCONN);
    if (ret != 0) {
        log_perr("listen");
        exit(EXIT_FAILURE);
    }

    /* handle clients */
    while (1) {
        /* accept connection */
        cli_fd = accept(srv_fd, (struct sockaddr *) &cli_addr, &cli_len);
        if (cli_fd == -1) {
            log_perr("accept");
            continue;
        }

        /* TODO: authenticate */

        /* TODO: do something useful */
        char *s = "hello! and bye bye\n";
        sock_write(cli_fd, s, strlen(s));

        /* close again */
        ret = sock_close(cli_fd);
        if (ret < 0) {
            exit(EXIT_FAILURE);
        }
    }

    return 0;
}
