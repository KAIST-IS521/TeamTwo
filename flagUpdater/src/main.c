#include <stdlib.h>
#include <stdio.h>

#include "logger.h"
#include "ip.h"
#include "sock.h"
#include "gpg.h"

#define MAX_BUF (1024 * 8)
#define GPG_PRIV_KEY "priv_key.asc"
#define GPG_PUB_KEY "pub_key.asc"
#define GPG_KEYS_DIR "authorized_keys"
#define GPG_PATTERN "-----END PGP MESSAGE-----"

int authenticate(int sockfd, char *username, char **fpr)
{
    int ret, r, r2;
    char *key, *sign, *cipher, *cipher_response, *sign_response, *plain_response;
    char buf[MAX_BUF] = { '\0' };
    char keypath[MAX_BUF] = { '\0' };

    /* construct path for where key should be */
    snprintf(keypath, MAX_BUF, "%s/%s.pub", GPG_KEYS_DIR, username);

    /* try to find key */
    bzero(buf, MAX_BUF);
    ret = gpg_import_key(keypath, &key);
    if (ret == EGPG_UNKNOWN) {
        log_info("not found");

        sprintf(buf, "access denied\n");
        sock_write(sockfd, buf, strlen(buf));
        return 1;
    }
    else if (ret != 0) {
        log_warnf("failed to find key '%s'", keypath);
        return -1;
    }

    log_infof("found key %s", key);

    /* generate random number */
    /* TODO: secure? */
    r = rand();

    bzero(buf, MAX_BUF);
    sprintf(buf, "%d", r);

    /* sign */
    ret = gpg_sign(buf, strlen(buf), &sign);
    if (ret < 0) {
        log_warnf("failed to sign nonce '%d'", r);
        return -1;
    }

    /* encrypt */
    ret = gpg_encrypt(key, sign, strlen(sign), &cipher);
    if (ret < 0) {
        log_warn("failed to encrypt signed nonce");
        return -1;
    }

    /* send challenge */
    log_infof("sending nonce '%d' as %zu byte cipher", r, strlen(cipher));
    sock_write(sockfd, cipher, strlen(cipher));

    /* get response */
    bzero(buf, MAX_BUF);
    sock_read_multiline(sockfd, buf, MAX_BUF, GPG_PATTERN);

    cipher_response = strdup(buf);

    /* decrypt response */
    ret = gpg_decrypt(cipher_response, &sign_response);
    if (ret < 0) {
        log_warn("failed to decrypt");
        return -1;
    }

    /* verify */
    ret = gpg_verify(key, sign_response, &plain_response);
    if (ret < 0) {
        log_warn("failed to verify");
        return -1;
    }

    r2 = atoi(plain_response);
    log_infof("received nonce '%d' as %zu byte cipher", r2, strlen(cipher_response));

    /* set client fingerprint */
    *fpr = strdup(key);

    /* clean up */
    free(key);
    free(sign);
    free(cipher);
    free(sign_response);
    free(cipher_response);
    free(plain_response);

    /* check correct number */
    return (r2 == r ? 0 : 1);
}

void new_client_cb(int sockfd)
{
    int ret;
    char buf[MAX_BUF] = { '\0' };
    char *s, *username, *fpr;

    log_infof("=========== sock %d ===========", sockfd);

    /* prompt for username */
    sprintf(buf, "username: ");
    sock_write(sockfd, buf, strlen(buf));

    /* read username */
    bzero(buf, MAX_BUF);
    sock_read(sockfd, buf, MAX_BUF);
    username = strdup(buf);

    log_infof("username: %s", username);

    /* try to authenticate client */
    ret = authenticate(sockfd, username, &fpr);
    if (ret == 0) {
        log_infof("authentication successful!");
        s = "authentication successful\n";
        sock_write(sockfd, s, strlen(s));
    }
    else if (ret == 1) {
        log_infof("access denied");
        s = "authentication failed\n";
        sock_write(sockfd, s, strlen(s));
    }
    else {
        log_errf("authentication failed");
        s = "authentication failed\n";
        sock_write(sockfd, s, strlen(s));
    }
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

    gpg_init(GPG_PRIV_KEY);

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
    ret = sock_listen(srv_fd, new_client_cb);
    if (ret < 0) {
        exit(EXIT_FAILURE);
    }

    gpg_free();

    return 0;
}
