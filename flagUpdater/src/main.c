#include <stdlib.h>
#include <stdio.h>
#include <jansson.h>

#include "logger.h"
#include "sock.h"
#include "gpg.h"
#include "json.h"
#include "base64.h"
#include "file.h"
#include "time.h"

#define MAX_BUF (1024 * 8)

#define GPG_KEYS_DIR "authorized_keys"
#define GPG_PATTERN "-----END PGP MESSAGE-----"

#define FLAG_DIR "/var/ctf"
#define FLAG_PATH "/var/ctf/shoppingmall.flag"

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

int parse_flag_data(const char *json_text,
                    char **signer, char **flag, char **signature)
{
    int ret;
    json_t *root, *value;

    /* parse json data */
    ret = json_parse(json_text, &root);
    if (ret < 0) {
        log_err("could not parse json");
        return -1;
    }

    /* get data */
    value = json_object_get(root, "signer");
    if (!json_is_string(value) || strlen(json_string_value(value)) < 1) {
        log_errf("json missing signer");
        return 1;
    }
    *signer = strdup(json_string_value(value));

    value = json_object_get(root, "newflag");
    if (!json_is_string(value) || strlen(json_string_value(value)) < 1) {
        log_errf("json missing newflag");
        return 1;
    }
    *flag = strdup(json_string_value(value));

    value = json_object_get(root, "signature");
    if (!json_is_string(value) || strlen(json_string_value(value)) < 1) {
        log_errf("json missing signature");
        return 1;
    }
    *signature = strdup(json_string_value(value));

    return 0;
}

int validate_flag_data(const char *username, const char *fpr,
                       const char *signer, const char *flag, const char *signature)
{
    int ret;
    char buf[MAX_BUF] = { '\0' };
    char *json_sign_pgp, *json_sign_plain;

    /* check signer matches */
    if (strncmp(username, signer, strlen(username)) != 0) {
        log_errf("json has invalid signer '%s'", signer);
        return -1;
    }

    /* decode signature */
    size_t json_sign_len;
    ret = base64_decode(signature, (unsigned char **) &json_sign_pgp, &json_sign_len);
    if (ret < 0) {
        log_err("failed to decode base64 flag signature");
        return -1;
    }

    /* verify signature */
    ret = gpg_verify(fpr, json_sign_pgp, &json_sign_plain);
    if (ret < 0) {
        log_err("failed to verify flag signature");
        return -1;
    }

    /* compare decrypted signature */
    sprintf(buf, "%s:%s", username, flag);
    if (strncmp(buf, json_sign_plain, strlen(username) + strlen(flag) + 1) != 0) {
        log_errf("flag signature does not match"
                 "\nwant: %s\ngot: %s", buf, json_sign_plain);
        return -1;
    }

    /* clean up */
    free(json_sign_pgp);
    free(json_sign_plain);

    return 0;
}

int update_flag(const char *path, const char *flag)
{
    int ret;

    /* log whether flag already exists */
    if (!file_exists(path)) {
        log_infof("init flag '%s'", path);
    }

    /* write new flag */
    ret = file_write(path, flag);
    if (ret < 0) {
        return -1;
    }

    return 0;
}

void new_client_cb(int sockfd)
{
    int ret;
    char buf[MAX_BUF] = { '\0' };
    char *time, *username, *fpr, *json_text,
        *json_signer, *json_flag, *json_sign;

    time = time_now();

    log_infof("=========== sock %02d ===========", sockfd);
    log_infof("time: %s", time);

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
        log_infof("authentication successful");
        sprintf(buf, "authentication successful\n");
        sock_write(sockfd, buf, strlen(buf));
    }
    else if (ret == 1) {
        log_infof("access denied");
        sprintf(buf, "authentication failed\n");
        sock_write(sockfd, buf, strlen(buf));
    }
    else {
        log_errf("authentication failed");
        sprintf(buf, "authentication failed\n");
        sock_write(sockfd, buf, strlen(buf));
    }

    /* read encrypted json */
    bzero(buf, MAX_BUF);
    sock_read_multiline(sockfd, buf, MAX_BUF, GPG_PATTERN);

    /* decrypt json data */
    ret = gpg_decrypt(buf, &json_text);
    if (ret < 0) {
        log_warn("failed to decrypt json");
        sprintf(buf, "invalid pgp block\n");
        sock_write(sockfd, buf, strlen(buf));
        return;
    }

    /* parse json data */
    ret = parse_flag_data(json_text, &json_signer, &json_flag, &json_sign);
    if (ret != 0) {
        if (ret < 0) {
            sprintf(buf, "invalid json\n");
            sock_write(sockfd, buf, strlen(buf));
        } else if (ret > 0) {
            sprintf(buf, "invalid flag data\n");
            sock_write(sockfd, buf, strlen(buf));
        }

        /* json error message has already been printed */
        return;
    }

    log_infof("got decrypted json:\n%s", json_text);

    /* validate flag signature */
    ret = validate_flag_data(username, fpr, json_signer, json_flag, json_sign);
    if (ret < 0) {
        log_errf("failed to validate new flag");
        sprintf(buf, "invalid flag data\n");
        sock_write(sockfd, buf, strlen(buf));
        return;
    }

    log_info("flag signature verified");

    /* update flag */
    bzero(buf, MAX_BUF);
    sprintf(buf, "%s\n", json_flag);
    ret = update_flag(FLAG_PATH, buf);
    if (ret < 0) {
        log_err("failed to update flag");
        sprintf(buf, "failed to update flag\n");
        sock_write(sockfd, buf, strlen(buf));
        return;
    }

    log_info("flag updated");

    /* send last result */
    sprintf(buf, "successfully updated flag\n");
    sock_write(sockfd, buf, strlen(buf));

    log_info("===============================");

    /* clean up */
    free(json_signer);
    free(json_flag);
    free(json_sign);
    free(time);
}

int main(int argc, char *argv[])
{
    int ret;
    char *ip, *priv_key;
    int port;
    int srv_fd;

    if (argc < 2) {
        log_errf("usage: %s <priv_key>", argv[0]);
        exit(EXIT_FAILURE);
    }

    /* set default values */
    ip = "127.0.0.1";
    port = 42;

    /* parse private key */
    priv_key = strdup(argv[1]);
    if (!file_exists(priv_key)) {
        log_errf("failed to open private key '%s'", priv_key);
        exit(EXIT_FAILURE);
    }

    /* init crypto engine and keys */
    ret = gpg_init(priv_key);
    if (ret < 0) {
        log_errf("failed to init crypto engine");
        exit(EXIT_FAILURE);
    }

    /* check that /var/ctf exists */
    if (!file_exists(FLAG_DIR)) {
        log_info("init directory '" FLAG_DIR "'");
        ret = file_mkdir(FLAG_DIR);
        if (ret < 0) {
            log_errf("could not make dir '%s'", FLAG_DIR);
            exit(EXIT_FAILURE);
        }
    }

    /* check gpg keys dir exists */
    if (!file_exists(GPG_KEYS_DIR)) {
        log_err("failed to open " GPG_KEYS_DIR " directory");
        exit(EXIT_FAILURE);
    }

    /* open socket */
    srv_fd = sock_open(ip, port);
    if (srv_fd < 0) {
        log_err("failed to open socket");
        exit(EXIT_FAILURE);
    }

    log_infof("listening port %d...", port);

    /* TODO: daemonize */

    /* synchronously handle clients */
    ret = sock_listen(srv_fd, new_client_cb);
    if (ret < 0) {
        exit(EXIT_FAILURE);
    }

    /* clean up */
    gpg_free();
    free(priv_key);

    return 0;
}
