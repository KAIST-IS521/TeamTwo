#include "base64.h"

size_t base64_calc_decodelen(const char* b64input);

int base64_encode(const unsigned char *input, size_t length, char **output)
{
    BIO *bio, *b64;
    BUF_MEM *buf;

    /* init BIO */
    b64 = BIO_new(BIO_f_base64());
    bio = BIO_new(BIO_s_mem());
    bio = BIO_push(b64, bio);

    /* do not flush output with newlines */
    BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL);

    /* encode */
    BIO_write(bio, input, length);
    BIO_flush(bio);

    /* get memory buffer with result */
    BIO_get_mem_ptr(bio, &buf);

    /* get result in output pointer */
    /* NOTE: +1 for null char */
    *output = (char *) malloc(buf->length + 1);
    memcpy(*output, buf->data, buf->length);
    (*output)[buf->length] = '\0';

    /* clean up */
    BIO_free_all(bio);

    return 0;
}

int base64_decode(const char *input, unsigned char **output, size_t *out_len)
{
    size_t len;
    BIO *bio, *b64;

    /* calculate output length and allocate memory */
    len = base64_calc_decodelen(input);

    /* include space for null char */
    *output = (unsigned char *) malloc(len + 1);
    /* null terminate output string */
    (*output)[len] = '\0';

    /* initialize BIO */
    bio = BIO_new_mem_buf(input, -1);
    b64 = BIO_new(BIO_f_base64());
    bio = BIO_push(b64, bio);

    /* do not use newlines to flush output */
    BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL);

    /* decode */
    *out_len = BIO_read(bio, *output, strlen(input));

    /* length of result should be as expected */
    if (*out_len != len) {
        return -1;
    }

    /* clean up */
    BIO_free_all(bio);

    return 0;
}

size_t base64_calc_decodelen(const char *input)
{
    size_t len, padding;

    len = strlen(input);
    padding = 0;

    /* check if input postfixed with padding */
    if (len >= 1 && input[len - 1] == '=') {
        if (len >= 2 && input[len - 2] == '=') {
            padding = 2;        /* two last */
        } else {
            padding = 1;        /* only last */
        }
    }

    return (len * 3) / 4 - padding;
}
