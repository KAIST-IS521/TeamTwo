#include <stdlib.h>
#include <stdio.h>

#include "logger.h"
#include "ip.h"
#include "sock.h"
#include "gpg.h"

#define MAX_BUF (1024 * 8)

void sock_cb(int sockfd)
{
    int ret, r;
    char *username, *key, *sign, *cipher;
    char buf[MAX_BUF] = { '\0' };
    char keypath[MAX_BUF] = { '\0' };

    log_infof("connection %d", sockfd);

    sprintf(buf, "username: ");
    sock_write(sockfd, buf, strlen(buf));

    bzero(buf, MAX_BUF);
    sock_read(sockfd, buf, MAX_BUF);
    username = strdup(buf);

    log_infof("username: %s", username);

    /* construct path for where key should be */
    sprintf(keypath, "%s/%s.pub", GPG_KEYS_DIR, username);

    log_infof("looking for key %s", keypath);

    /* try to find key */
    bzero(buf, MAX_BUF);
    ret = gpg_import_key(keypath, &key);
    if (ret == EGPG_UNKNOWN) {
        log_info("not found");

        sprintf(buf, "access denied\n");
        sock_write(sockfd, buf, strlen(buf));
        return;
    }
    else if (ret != 0) {
        log_warnf("failed to find key '%s'", keypath);
        return;
    }

    log_infof("found key %s", key);

    /* generate random number */
    /* TODO: secure? */
    /* r = rand(); */
    r = 1337;

    bzero(buf, MAX_BUF);
    sprintf(buf, "%d", r);

    /* sign */
    ret = gpg_sign(buf, sizeof(int), &sign);
    if (ret < 0) {
        log_warnf("failed to sign nonce '%d'", r);
        return;
    }

    log_infof("signed nonce:\n%s", sign);

    /* encrypt */
    ret = gpg_encrypt(key, sign, strlen(sign), &cipher);
    if (ret < 0) {
        log_warn("failed to encrypt signed nonce");
        return;
    }

    log_infof("cipher:\n%s", cipher);

    char *test;
    ret = gpg_decrypt(cipher, &test);
    if (ret < 0) {
        log_warn("failed to decrypt");
        return;
    }

    log_infof("test:\n%s", test);

    if (strcmp(test, sign) != 0) {
        log_errf("failed to compare");
    }


    /* send random number */
    log_infof("sending nonce '%d' as cipher[%zu]\n%s", r, strlen(cipher), cipher);
    sock_write(sockfd, cipher, strlen(cipher));
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

    gpg_init();

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

    gpg_free();

    return 0;
}
