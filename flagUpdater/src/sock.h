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

#include "logger.h"

#define MAX_BUF   (1024)

int sock_open(const char* ip, int port);
int sock_read(int sockfd, char *buffer, size_t size);
int sock_write(int sockfd, char *buffer, size_t size);
int sock_close(int sockfd);
/* int sock_auth(int sockfd, const char *id, const char *pw); */

#endif /* SOCK_H */
