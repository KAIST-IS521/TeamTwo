#ifndef SOCK_H
#define SOCK_H

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/wait.h>
#include <arpa/inet.h>
#include <netdb.h>

#include "logger.h"

#define SOCK_TIMEOUT (5)

typedef void (*sock_listen_cb_t)(int sockfd);

int sock_open(const char* ip, int port);
int sock_listen(int sockfd, sock_listen_cb_t cb);
int sock_connect(int *sockfd, const char *hostname, int port);
int sock_read(int sockfd, char *buffer, size_t size);
int sock_read_multiline(int sockfd, char *buffer, size_t size, char *pattern);
int sock_write(int sockfd, char *buffer, size_t size);
int sock_close(int sockfd);

#endif /* SOCK_H */
