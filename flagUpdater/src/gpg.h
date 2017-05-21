#ifndef GPG_H
#define GPG_H

#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <locale.h>
#include <string.h>
#include <gpgme.h>

#include "logger.h"

#define gpg_fail_if_err(err)                                            \
    do {                                                                \
        if (err != GPG_ERR_NO_ERROR) {                                  \
            fprintf(stderr, "[\x1B[31m!\x1B[0m] %s: %s\n",              \
                    gpgme_strsource(err), gpgme_strerror(err));         \
            return -1;                                                  \
        }                                                               \
    }                                                                   \
    while (0)

/* errors */
#define EGPG_UNKNOWN (1)

/* constants */
#define GPG_PRIV_KEY "priv_key.asc"
#define GPG_PUB_KEY "pub_key.asc"
#define GPG_KEYS_DIR "keys"

int gpg_init();
void gpg_free();
int gpg_import_key(char *keypath, char **fp);
int gpg_export_pub_key(char **buffer);
int gpg_encrypt(const char *fpr, const char *plain, size_t size, char **cipher);
int gpg_sign(const char *plain, size_t size, char **cipher);

#endif /* GPG_H */
