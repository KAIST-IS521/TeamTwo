#include "gpg.h"

gpgme_ctx_t gpg_ctx;
char *gpg_fp;

/* debug protos */
void gpg_print_data(gpgme_data_t data);
void gpg_list_keys(const char *pattern);

int gpg_init()
{
    int ret;
    gpgme_error_t err;

    /* TODO: clean */
    gpgme_check_version(NULL);
    setlocale(LC_ALL, "");
    gpgme_set_locale(NULL, LC_CTYPE, setlocale (LC_CTYPE, NULL));

    /* check gpg is installed properly */
    err = gpgme_engine_check_version(GPGME_PROTOCOL_OpenPGP);
    if (err != GPG_ERR_NO_ERROR) {
        log_gpgerr(err);
        return -1;
    }

    err = gpgme_new(&gpg_ctx);
    if (err != GPG_ERR_NO_ERROR) {
        log_gpgerr(err);
        return -1;
    }

    /* armor data before sending as text */
    gpgme_set_armor(gpg_ctx, 1);

    /* import private key */
    ret = gpg_import_key(GPG_PRIV_KEY, &gpg_fp);
    if (ret < 0) {
        return -1;
    }

    return 0;
}

void gpg_free()
{
    if (gpg_fp != NULL) {
        free(gpg_fp);
    }
    gpgme_release(gpg_ctx);
}

int gpg_encrypt(const char *fpr, const char *plain, char **cipher)
{
    int ret;
    size_t size;
    gpgme_error_t err;
    gpgme_data_t in, out;
    gpgme_encrypt_result_t result;
    gpgme_key_t key[2] = { 0 };

    /* get public key of receiver */
    err = gpgme_get_key(gpg_ctx, fpr, &key[0], 0);
    if (err) {
        log_gpgerr(err);
        return -1;
    }

    /* get plain text to encrypt */
    err = gpgme_data_new_from_mem(&in, plain, strlen(plain), 0);
    if (err) {
        log_gpgerr(err);
        return -1;
    }

    /* init out data buffer */
    err = gpgme_data_new(&out);
    fail_if_err (err);

    /* encrypt */
    err = gpgme_op_encrypt(gpg_ctx, key, GPGME_ENCRYPT_ALWAYS_TRUST, in, out);
    fail_if_err (err);

    /* check result */
    result = gpgme_op_encrypt_result (gpg_ctx);
    if (result->invalid_recipients) {
        fprintf (stderr, "Invalid recipient encountered: %s\n",
                 result->invalid_recipients->fpr);
        exit (1);
    }

    /* seek to end of buffer to get size of output */
    ret = gpgme_data_seek(out, 0, SEEK_END);
    if (ret < 0) {
        err = gpgme_err_code_from_errno(errno);
        log_gpgerr(err);
        return -1;
    }

    /* offset from start equals size of buffer */
    size = ret;

    /* allocate memory and copy data over */
    *cipher = malloc(size);
    ret = gpgme_data_seek(out, 0, SEEK_SET);
    ret = gpgme_data_read(out, *cipher, size);

    /* clean up */
    gpgme_data_release(in);
    gpgme_data_release(out);

    return 0;
}

int gpg_sign(const char *plain, char **cipher)
{
    return gpg_encrypt(gpg_fp, plain, cipher);
}

int gpg_import_key(char *keypath, char **fp)
{
    gpgme_error_t err;
    gpgme_import_result_t result;
    gpgme_data_t data;

    log_infof("importing '%s'...", keypath);

    /* read file into data */
    err = gpgme_data_new_from_file(&data, keypath, 1);
    /* check if file was not found */
    if (err == GPG_ERR_INV_VALUE) {
        return EGPG_UNKNOWN;
    }
    else if (err != GPG_ERR_NO_ERROR) {
        log_gpgerr(err);
        return -1;
    }

    /* try import key from data */
    err = gpgme_op_import(gpg_ctx, data);
    if (err) {
        log_gpgerr(err);
        return -1;
    }

    /* check result is good */
    result = gpgme_op_import_result(gpg_ctx);
    if (!result) {
        log_errf("could not import key '%s'", keypath);
        return -1;
    }

    /* set fingerprint of imported key */
    *fp = strdup(result->imports->fpr);

    log_infof("imported key %s", *fp);

    /* clean up */
    gpgme_data_release(data);

    return 0;
}

/* debug functions */

void gpg_list_keys(const char *pattern)
{
    gpgme_error_t err;
    gpgme_key_t key;

    err = gpgme_op_keylist_start(gpg_ctx, pattern, 0);
    while (!err) {
        err = gpgme_op_keylist_next(gpg_ctx, &key);
        if (err) break;

        printf ("%s:", key->subkeys->keyid);
        if (key->uids && key->uids->name)
            printf (" %s", key->uids->name);
        if (key->uids && key->uids->email)
            printf (" <%s>", key->uids->email);
        putchar ('\n');

        gpgme_key_release(key);
    }

    if (gpg_err_code (err) != GPG_ERR_EOF) {
        log_errf("can not list keys: %s\n", gpgme_strerror (err));
    }
}

void gpg_print_data(gpgme_data_t data)
{
    int ret;
    int buf_size = 256;
    char buf[buf_size + 1];
    gpgme_error_t err;

    /* set pointer to start of data */
    ret = gpgme_data_seek(data, 0, SEEK_SET);
    if (ret != 0) {
        err = gpgme_err_code_from_errno(errno);
        if (err != GPG_ERR_NO_ERROR) {
            log_gpgerr(err);
            return;
        }
    }

    /* print 256 bytes at the time */
    while ((ret = gpgme_data_read(data, buf, buf_size)) > 0) {
        fwrite(buf, ret, 1, stdout);
    }

    /* check everything went well */
    if (ret < 0) {
        err = gpgme_err_code_from_errno(errno);
        log_gpgerr(err);
        return;
    }

    /* reset data pointer */
    ret = gpgme_data_seek(data, 0, SEEK_SET);
    if (ret < 0) {
        err = gpgme_err_code_from_errno(errno);
        log_gpgerr(err);
        return;
    }
}
