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

/* int sock_auth(int sockfd, const char *id, const char *pw) */
/* { */
/*     int ret; */
/*     char buf[MAX_BUF] = { '\0' }; */

/*     const char* s_name = "username: "; */
/*     const char* s_name_err = "[error] unknown username\n"; */
/*     const char* s_pwd = "password: "; */
/*     const char* s_pwd_err = "[error] wrong password given\n"; */

/*     /\* send username prompt *\/ */
/*     ret = send(sockfd, s_name, strlen(s_name), 0); */
/*     if (ret == -1) { */
/*         perror( "send" ); */
/*         return -1; */
/*     } */

/*     /\* read username *\/ */
/*     ret = sock_read(sockfd, buf, MAX_BUF); */
/*     if (ret == -1) */
/*         return -1; */

/*     /\* match username *\/ */
/*     if (strncmp(buf, id, MAX_BUF - 1) != 0) { */
/*         send(sockfd, s_name_err, strlen(s_name_err), 0); */
/*         return -1; */
/*     } */

/*     /\* send password prompt *\/ */
/*     ret = send(sockfd, s_pwd, strlen(s_pwd), 0); */
/*     if (ret == -1) { */
/*         log_perr("send"); */
/*         return -1; */
/*     } */

/*     /\* read password *\/ */
/*     ret = sock_read(sockfd, buf, MAX_BUF); */
/*     if (ret == -1) */
/*         return -1; */

/*     /\* match password *\/ */
/*     if (strncmp(buf, pw, MAX_BUF - 1) != 0) { */
/*         send(sockfd, s_pwd_err, strlen(s_pwd_err), 0); */
/*         return -1; */
/*     } */

/*     return 0; */
/* } */
