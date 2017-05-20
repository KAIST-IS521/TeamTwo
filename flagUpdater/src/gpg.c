#include "gpg.h"

gpgme_ctx_t gpg_ctx;
char *gpg_fpr;

/* debug protos */
int gpg_print_data(gpgme_data_t data);
void gpg_list_keys(const char *pattern);

int gpg_init(const char *priv_key)
{
    int ret;
    gpgme_error_t err;
    gpgme_key_t key[2] = { 0 };

    /* TODO: clean */
    gpgme_check_version(NULL);
    setlocale(LC_ALL, "");
    gpgme_set_locale(NULL, LC_CTYPE, setlocale (LC_CTYPE, NULL));

    /* check gpg is installed properly */
    err = gpgme_engine_check_version(GPGME_PROTOCOL_OpenPGP);
    gpg_fail_if_err(err);

    err = gpgme_new(&gpg_ctx);
    gpg_fail_if_err(err);

    /* armor data before sending as text */
    gpgme_set_armor(gpg_ctx, 1);

    /* import private key */
    /* ret = gpg_import_key("pub_key.asc", &gpg_fpr); */
    ret = gpg_import_key(priv_key, &gpg_fpr);
    if (ret < 0) {
        log_errf("failed to import key '%s'", priv_key);
        return -1;
    }

    /* get imported key */
    err = gpgme_get_key(gpg_ctx, gpg_fpr, &key[0], 0);
    gpg_fail_if_err(err);

    /* set as signing key */
    err = gpgme_signers_add(gpg_ctx, key[0]);
    gpg_fail_if_err(err);

    return 0;
}

void gpg_free()
{
    if (gpg_fpr != NULL) {
        free(gpg_fpr);
    }

    gpgme_release(gpg_ctx);
}

int gpg_encrypt(const char *fpr, const char *plain, size_t size, char **cipher)
{
    size_t out_size;
    gpgme_error_t err;
    gpgme_data_t in, out;
    gpgme_encrypt_result_t result;
    gpgme_key_t key[2] = { 0 };

    /* get public key of receiver */
    err = gpgme_get_key(gpg_ctx, fpr, &key[0], 0);
    gpg_fail_if_err(err);

    /* get plain text to encrypt */
    err = gpgme_data_new_from_mem(&in, plain, size, 0);
    gpg_fail_if_err(err);

    /* init out data buffer */
    err = gpgme_data_new(&out);
    gpg_fail_if_err(err);

    /* encrypt */
    err = gpgme_op_encrypt(gpg_ctx, key, GPGME_ENCRYPT_ALWAYS_TRUST, in, out);
    gpg_fail_if_err(err);

    /* check result */
    result = gpgme_op_encrypt_result(gpg_ctx);
    if (result->invalid_recipients) {
        log_errf("invalid recipient '%s'", result->invalid_recipients->fpr);
        return -1;
    }

    /* get result */
    *cipher = gpgme_data_release_and_get_mem(out, &out_size);
    (*cipher)[out_size - 1] = '\0';

    /* clean up */
    gpgme_data_release(in);

    return 0;
}

int gpg_sign(const char *plain, size_t size, char **cipher)
{
    size_t out_size;
    gpgme_error_t err;
    gpgme_data_t in, out;
    gpgme_sign_result_t result;
    gpgme_new_signature_t sig;

    /* get text to sign */
    err = gpgme_data_new_from_mem(&in, plain, size, 0);
    gpg_fail_if_err(err);

    /* init out data buffer */
    err = gpgme_data_new(&out);
    gpg_fail_if_err(err);

    /* sign */
    err = gpgme_op_sign(gpg_ctx, in, out, GPGME_SIG_MODE_NORMAL);
    gpg_fail_if_err(err);

    /* check result */
    result = gpgme_op_sign_result(gpg_ctx);
    if (result->invalid_signers) {
        log_errf("invalid signers '%s'", result->invalid_signers->fpr);
        return -1;
    }

    /* check that only our private key signed */
    sig = result->signatures;
    do {
        if (strcmp(sig->fpr, gpg_fpr) != 0) {
            log_infof("signed by unexpected key '%s'", sig->fpr);
            return -1;
        }
    } while ((sig = result->signatures->next) != NULL);

    /* get result */
    *cipher = gpgme_data_release_and_get_mem(out, &out_size);
    (*cipher)[out_size - 1] = '\0';

    /* clean up */
    gpgme_data_release(in);

    return 0;
}

int gpg_decrypt(const char *cipher, char **plain)
{
    size_t size;
    gpgme_error_t err;
    gpgme_data_t in, out;
    gpgme_decrypt_result_t result;

    /* get cipher text to decrypt */
    err = gpgme_data_new_from_mem(&in, cipher, strlen(cipher), 0);
    gpg_fail_if_err(err);

    /* init out data buffer */
    err = gpgme_data_new(&out);
    gpg_fail_if_err(err);

    /* decrypt */
    err = gpgme_op_decrypt(gpg_ctx, in, out);
    gpg_fail_if_err(err);

    /* check result */
    result = gpgme_op_decrypt_result(gpg_ctx);
    if (result->unsupported_algorithm) {
        log_errf("unsupported algorithm '%s'", result->unsupported_algorithm);
        return -1;
    }

    /* get result */
    *plain = gpgme_data_release_and_get_mem(out, &size);
    (*plain)[size - 1] = '\0';

    /* clean up */
    gpgme_data_release(in);

    return 0;
}

int gpg_import_key(char *keypath, char **fp)
{
    gpgme_error_t err;
    gpgme_import_result_t result;
    gpgme_data_t data;

    /* check file exists */
    if (access(keypath, F_OK) == -1) {
        return EGPG_UNKNOWN;
    }

    /* read file into data */
    err = gpgme_data_new_from_file(&data, keypath, 1);
    gpg_fail_if_err(err);

    /* try import key from data */
    err = gpgme_op_import(gpg_ctx, data);
    gpg_fail_if_err(err);

    /* check result is good */
    result = gpgme_op_import_result(gpg_ctx);
    if (!result) {
        log_errf("could not import key '%s'", keypath);
        return -1;
    }

    /* set fingerprint of imported key */
    *fp = strdup(result->imports->fpr);

    /* clean up */
    gpgme_data_release(data);

    return 0;
}

int gpg_export_pub_key(char **buffer)
{
    int ret, size;
    gpgme_error_t err;
    gpgme_data_t out;
    gpgme_key_t key[2] = { 0 };

    /* init temporary gpg data buffer */
    err = gpgme_data_new(&out);
    gpg_fail_if_err(err);

    /* get public key */
    err = gpgme_get_key(gpg_ctx, gpg_fpr, &key[0], 0);
    gpg_fail_if_err(err);

    /* export key to data buffer */
    err = gpgme_op_export_keys(gpg_ctx, key, 0, out);
    gpg_fail_if_err(err);

    /* seek to end of buffer to get size of output */
    ret = gpgme_data_seek(out, 0, SEEK_END);
    if (ret < 0) { gpg_fail_if_err(err); }

    /* offset from start equals size of buffer */
    size = ret;

    /* allocate memory at given size */
    *buffer = malloc(size);

    /* now copy data directly over to allocated buffer */
    ret = gpgme_data_seek(out, 0, SEEK_SET);
    if (ret < 0) { gpg_fail_if_err(err); }
    ret = gpgme_data_read(out, *buffer, size);
    if (ret < 0) { gpg_fail_if_err(err); }

    /* clean up */
    gpgme_data_release(out);

    return 0;
}

/* debug functions */

void gpg_list_keys(const char *pattern)
{
    gpgme_error_t err;
    gpgme_key_t key;

    err = gpgme_op_keylist_start(gpg_ctx, pattern, 0);
    while (err == GPG_ERR_NO_ERROR) {
        err = gpgme_op_keylist_next(gpg_ctx, &key);
        if (err) break;

        printf("%s:", key->subkeys->keyid);
        if (key->uids && key->uids->name)
            printf(" %s", key->uids->name);
        if (key->uids && key->uids->email)
            printf(" <%s>", key->uids->email);
        putchar('\n');

        gpgme_key_release(key);
    }

    if (gpg_err_code(err) != GPG_ERR_EOF) {
        log_errf("cannot list keys: %s", gpgme_strerror(err));
    }
}

int gpg_print_data(gpgme_data_t data)
{
    int ret;
    int buf_size = 256;
    char buf[buf_size + 1];

    /* set pointer to start of data */
    ret = gpgme_data_seek(data, 0, SEEK_SET);
    if (ret != 0) {
        gpg_fail_if_err(gpgme_err_code_from_errno(errno));
    }

    /* print 256 bytes at the time */
    while ((ret = gpgme_data_read(data, buf, buf_size)) > 0) {
        fwrite(buf, ret, 1, stdout);
    }

    /* check everything went well */
    if (ret < 0) {
        gpg_fail_if_err(gpgme_err_code_from_errno(errno));
    }

    /* reset data pointer */
    ret = gpgme_data_seek(data, 0, SEEK_SET);
    if (ret < 0) {
        gpg_fail_if_err(gpgme_err_code_from_errno(errno));
    }

    return 0;
}
