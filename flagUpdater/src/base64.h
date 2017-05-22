#ifndef BASE64_H
#define BASE64_H

#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <openssl/bio.h>
#include <openssl/evp.h>
#include <openssl/buffer.h>

int base64_encode(const unsigned char *input, size_t length, char **output);
int base64_decode(const char *input, unsigned char **output, size_t *out_len);

#endif /* BASE64_H */
