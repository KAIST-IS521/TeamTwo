#include <stdlib.h>
#include <stdio.h>

#include "logger.h"
#include "ip.h"
#include "sock.h"

void sock_cb(int sockfd)
{
    char *username;
    char buf[MAX_BUF] = { '\0' };

    log_infof("connection %d", sockfd);

    sprintf(buf, "username: ");
    sock_write(sockfd, buf, strlen("username: "));

    bzero(buf, MAX_BUF);
    sock_read(sockfd, buf, MAX_BUF);
    username = strdup(buf);

    log_infof("username: %s", username);


    /* generate pseudo-random number */
    /* TODO: secure enough? */
    /* int r = rand(); */
}

int main(int argc, char *argv[])
{
    int ret;
    char *ip;
    int port;

    int srv_fd;

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

    log_infof("listening port %d...", port);

    /* synchronously handle clients */
    ret = sock_listen(srv_fd, sock_cb);
    if (ret < 0) {
        exit(EXIT_FAILURE);
    }

    return 0;
}
